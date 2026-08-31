require 'test_helper'

module Api
  module V1
    # 一覧エンドポイントのページネーション。
    #
    # 件数無制限の一覧はデータが増えるほどレスポンスが膨らむため、
    # 一覧を返す API はすべて pagination を含むこと自体を担保する。
    class PaginationTest < ApiTestCase
      setup do
        @creator = build_creator('PageCreator')
        @heir = build_heir('PageHeir')
      end

      # ── 一覧APIはすべて pagination を返す ────────────────────────

      test '一覧APIのレスポンスは items と pagination を持つ' do
        api_login(@heir)

        %w[
          /api/v1/creators
          /api/v1/favorites
          /api/v1/diaries
          /api/v1/galleries
          /api/v1/appeals
          /api/v1/scouts
          /api/v1/matches
          /api/v1/message_threads
        ].each do |path|
          api_get path
          assert_response :success, "#{path} が成功していない"
          assert json.key?('items'), "#{path} に items が無い"
          assert json.key?('pagination'), "#{path} に pagination が無い"
          assert_equal %w[currentPage totalCount totalPages],
                       json['pagination'].keys.sort, "#{path} の pagination の形が違う"
        end
      end

      # ── 日記フィード ─────────────────────────────────────────────

      test 'GET /api/v1/diaries — 既定は10件ずつ返る' do
        create_diaries(12)

        api_get '/api/v1/diaries', params: { user_id: @creator.id }
        assert_equal 10, json['items'].size
        assert_equal({ 'currentPage' => 1, 'totalPages' => 2, 'totalCount' => 12 },
                     json['pagination'])

        api_get '/api/v1/diaries', params: { user_id: @creator.id, page: 2 }
        assert_equal 2, json['items'].size
        assert_equal 2, json['pagination']['currentPage']
      end

      test 'GET /api/v1/diaries — 新しい順に並び、ページ間で重複しない' do
        create_diaries(12)

        api_get '/api/v1/diaries', params: { user_id: @creator.id }
        first_page = json['items'].pluck('diaryId')
        api_get '/api/v1/diaries', params: { user_id: @creator.id, page: 2 }
        second_page = json['items'].pluck('diaryId')

        assert_empty first_page & second_page
        assert_equal 12, (first_page + second_page).uniq.size
      end

      test 'GET /api/v1/diaries — 2ページ目でも集計(いいね/コメント)が正しく付く' do
        diaries = create_diaries(12)
        oldest = diaries.first # created_at が最も古い = 2ページ目に来る
        DiaryGood.create!(diary_id: oldest.id, user_id: @heir.id)
        DiaryComment.create!(diary_id: oldest.id, user_id: @heir.id, comment: '古い日記へのコメント')

        api_login(@heir)
        api_get '/api/v1/diaries', params: { user_id: @creator.id, page: 2 }
        item = json['items'].find { |d| d['diaryId'] == oldest.id }
        assert_not_nil item, '2ページ目に最古の日記が含まれていない'
        assert_equal 1, item['goodCount']
        assert_equal 1, item['commentCount']
        assert_equal true, item['myGood']
      end

      # ── ギャラリーフィード ───────────────────────────────────────

      test 'GET /api/v1/galleries — 既定は24件ずつ返る' do
        create_galleries(26)

        api_get '/api/v1/galleries', params: { user_id: @creator.id }
        assert_equal 24, json['items'].size
        assert_equal 26, json['pagination']['totalCount']

        api_get '/api/v1/galleries', params: { user_id: @creator.id, page: 2 }
        assert_equal 2, json['items'].size
      end

      test 'GET /api/v1/galleries — タグ絞り込みでもページネーションされる' do
        create_galleries(3, tag_list: '漆器')
        create_galleries(2, tag_list: '陶器')

        api_get '/api/v1/galleries', params: { user_id: @creator.id, tag: '漆器', per_page: 2 }
        assert_equal 2, json['items'].size
        assert_equal 3, json['pagination']['totalCount']
      end

      # ── per_page ─────────────────────────────────────────────────

      test 'per_page で1ページの件数を指定できる' do
        create_diaries(5)

        api_get '/api/v1/diaries', params: { user_id: @creator.id, per_page: 2 }
        assert_equal 2, json['items'].size
        assert_equal 3, json['pagination']['totalPages']
      end

      test 'per_page は MAX_PER_PAGE で打ち止めになる' do
        create_diaries(3)

        api_get '/api/v1/diaries', params: { user_id: @creator.id, per_page: 100_000 }
        assert_response :success
        # 打ち止めされていれば totalPages は 1（=上限内に収まる）
        assert_equal 1, json['pagination']['totalPages']
        assert_equal Api::BaseController::MAX_PER_PAGE, 100
      end

      test 'per_page に不正な値を渡しても既定値で動く' do
        create_diaries(12)

        ['', '0', '-5', 'abc'].each do |value|
          api_get '/api/v1/diaries', params: { user_id: @creator.id, per_page: value }
          assert_response :success, "per_page=#{value.inspect} で失敗した"
          assert_equal 10, json['items'].size, "per_page=#{value.inspect} で既定値になっていない"
        end
      end

      # ── 範囲外ページ ─────────────────────────────────────────────

      test '範囲外のページは 404 / page_out_of_range' do
        create_diaries(3)

        api_get '/api/v1/diaries', params: { user_id: @creator.id, page: 99 }
        assert_response :not_found
        assert_equal 'page_out_of_range', error_code
      end

      # ── メッセージ履歴 ───────────────────────────────────────────

      test 'GET /api/v1/message_threads/:id — 1ページ目は直近のメッセージが時系列順で返る' do
        30.times do |i|
          Message.create!(send_user_id: @heir.id, receive_user_id: @creator.id,
                          content: "message#{i}", created_at: (30 - i).minutes.ago)
        end

        api_login(@creator)
        api_get "/api/v1/message_threads/#{@heir.id}", params: { per_page: 10 }
        assert_response :success

        contents = json['messages'].pluck('content')
        # 直近10件(message20..29)が古い順に並ぶ
        assert_equal (20..29).map { |i| "message#{i}" }, contents
        assert_equal 3, json.dig('pagination', 'totalPages')
      end

      test 'GET /api/v1/message_threads/:id — page=2 で1つ前のページが取れる' do
        30.times do |i|
          Message.create!(send_user_id: @heir.id, receive_user_id: @creator.id,
                          content: "message#{i}", created_at: (30 - i).minutes.ago)
        end

        api_login(@creator)
        api_get "/api/v1/message_threads/#{@heir.id}", params: { per_page: 10, page: 2 }
        assert_equal (10..19).map { |i| "message#{i}" }, json['messages'].pluck('content')
      end

      private

      def create_diaries(count)
        Array.new(count) do |i|
          Diary.create!(user_id: @creator.id, content: "日記#{i}",
                        created_at: (count - i).minutes.ago)
        end
      end

      def create_galleries(count, tag_list: nil)
        Array.new(count) do |i|
          Gallery.create!(user_id: @creator.id, comment: "作品#{i}", tag_list: tag_list,
                          data: upload_fixture, created_at: (count - i).minutes.ago)
        end
      end
    end
  end
end
