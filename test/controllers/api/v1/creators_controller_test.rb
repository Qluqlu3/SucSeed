require 'test_helper'

module Api
  module V1
    class CreatorsControllerTest < ApiTestCase
      # ── 一覧 ──────────────────────────────────────────────────────

      test 'GET /api/v1/creators — 募集中の職人のみ返る' do
        recruiting = build_creator('Recruiting')
        build_creator('Closed', is_recruitment: false)

        api_get '/api/v1/creators'
        assert_response :success
        assert_equal [recruiting.id], json['items'].pluck('userId')
      end

      test 'GET /api/v1/creators — 未ログインでも取得できる' do
        build_creator('PublicCreator')

        api_get '/api/v1/creators'
        assert_response :success
      end

      test 'GET /api/v1/creators — art_category_id で絞り込める' do
        target = build_creator('PaintingCreator', art_category: art_categories(:one))
        build_creator('MusicCreator', art_category: art_categories(:two))

        api_get '/api/v1/creators', params: { art_category_id: art_categories(:one).id }
        assert_equal [target.id], json['items'].pluck('userId')
      end

      test 'GET /api/v1/creators — 1ページ12件でページネーションされる' do
        15.times { |i| build_creator("Paged#{i}") }

        api_get '/api/v1/creators'
        assert_equal 12, json['items'].size
        assert_equal({ 'currentPage' => 1, 'totalPages' => 2, 'totalCount' => 15 },
                     json['pagination'])

        api_get '/api/v1/creators', params: { page: 2 }
        assert_equal 3, json['items'].size
      end

      test 'GET /api/v1/creators — 範囲外ページは 404 / page_out_of_range' do
        build_creator('OnlyOne')

        api_get '/api/v1/creators', params: { page: 99 }
        assert_response :not_found
        assert_equal 'page_out_of_range', error_code
      end

      test 'GET /api/v1/creators — 職人としてログイン中は自分自身が除外される' do
        me = build_creator('MyselfCreator')
        other = build_creator('OtherCreator')

        api_login(me)
        api_get '/api/v1/creators'
        assert_equal [other.id], json['items'].pluck('userId')
      end

      test 'GET /api/v1/creators — ギャラリー枚数とサムネイルが含まれる' do
        creator = build_creator('WithGallery')
        Gallery.create!(user_id: creator.id, comment: 'work', data: sample_image)

        api_get '/api/v1/creators'
        item = json['items'].find { |c| c['userId'] == creator.id }
        assert_equal 1, item['galleryCount']
        assert item['galleryPreviewPath'].present?
      end

      # ── 詳細 ──────────────────────────────────────────────────────

      test 'GET /api/v1/creators/:id — 職人プロフィールが返る' do
        creator = build_creator('DetailCreator')

        api_get "/api/v1/creators/#{creator.id}"
        assert_response :success
        assert_equal creator.id, json['userId']
        assert_equal 'DetailCreator工房', json['title']
        assert_equal art_categories(:one).name, json['artCategoryName']
        assert_equal 'DetailCreator', json.dig('user', 'name')
      end

      test 'GET /api/v1/creators/:id — user にはメールアドレスなど非公開情報を含まない' do
        creator = build_creator('PrivacyCreator')

        api_get "/api/v1/creators/#{creator.id}"
        assert_not json['user'].key?('email')
        assert_not json['user'].key?('passwordDigest')
      end

      test 'GET /api/v1/creators/:id — 存在しない id は 404' do
        api_get '/api/v1/creators/does_not_exist'
        assert_response :not_found
        assert_equal 'not_found', error_code
      end

      test 'GET /api/v1/creators/:id — 未ログインでは関係フラグが全て false' do
        creator = build_creator('FlagCreator')

        api_get "/api/v1/creators/#{creator.id}"
        assert_equal false, json['isFavorited']
        assert_equal false, json['isAppealed']
        assert_equal false, json['isOwn']
      end

      test 'GET /api/v1/creators/:id — お気に入り済み・応募済みが反映される' do
        creator = build_creator('RelatedCreator')
        heir = build_heir('RelatedHeir')
        Favorite.create!(user_id: heir.id, favorite_user_id: creator.id)
        Match.create!(user_id: heir.id, target_user_id: creator.id, is_scout: false)

        api_login(heir)
        api_get "/api/v1/creators/#{creator.id}"
        assert_equal true, json['isFavorited']
        assert_equal true, json['isAppealed']
      end

      test 'GET /api/v1/creators/:id — 自分のページでは isOwn が true' do
        creator = build_creator('SelfCreator')

        api_login(creator)
        api_get "/api/v1/creators/#{creator.id}"
        assert_equal true, json['isOwn']
      end

      private

      def sample_image
        Rack::Test::UploadedFile.new(Rails.root.join('test/fixtures/files/valid_image.png'),
                                     'image/png')
      end
    end
  end
end
