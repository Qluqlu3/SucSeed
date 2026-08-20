require 'test_helper'

module Api
  module V1
    # 日記へのいいね / コメント（DiaryGoodsController・DiaryCommentsController）
    class DiaryInteractionsTest < ApiTestCase
      setup do
        @creator = build_creator('InteractionCreator')
        @heir = build_heir('InteractionHeir')
        @diary = Diary.create!(user_id: @creator.id, content: '日記本文')
      end

      # ── いいね ────────────────────────────────────────────────────

      test 'POST /diaries/:id/good — いいねできる' do
        api_login(@heir)
        api_post "/api/v1/diaries/#{@diary.id}/good"
        assert_response :created
        assert_equal 1, json['goodCount']
        assert_equal true, json['myGood']
        assert DiaryGood.exists?(diary_id: @diary.id, user_id: @heir.id)
      end

      test 'POST /diaries/:id/good — 二重いいねは 200 で現在の状態を返す(エラーにしない)' do
        DiaryGood.create!(diary_id: @diary.id, user_id: @heir.id)

        api_login(@heir)
        api_post "/api/v1/diaries/#{@diary.id}/good"
        assert_response :ok
        assert_equal 1, json['goodCount']
        assert_equal true, json['myGood']
        assert_equal 1, DiaryGood.where(diary_id: @diary.id).count
      end

      test 'DELETE /diaries/:id/good — いいねを取り消せる(HTML版には無かった操作)' do
        DiaryGood.create!(diary_id: @diary.id, user_id: @heir.id)

        api_login(@heir)
        api_delete "/api/v1/diaries/#{@diary.id}/good"
        assert_response :success
        assert_equal 0, json['goodCount']
        assert_equal false, json['myGood']
      end

      test 'DELETE /diaries/:id/good — 他人のいいねは消えない' do
        other = build_heir('OtherGoodHeir')
        DiaryGood.create!(diary_id: @diary.id, user_id: other.id)

        api_login(@heir)
        api_delete "/api/v1/diaries/#{@diary.id}/good"
        assert_equal 1, json['goodCount']
        assert_equal false, json['myGood']
      end

      test 'POST /diaries/:id/good — 未ログインは 401' do
        api_post "/api/v1/diaries/#{@diary.id}/good"
        assert_response :unauthorized
      end

      test 'POST /diaries/:id/good — 存在しない日記は 404' do
        api_login(@heir)
        api_post '/api/v1/diaries/no_such_diary/good'
        assert_response :not_found
      end

      # ── コメント ──────────────────────────────────────────────────

      test 'POST /diaries/:id/comments — コメントできる' do
        api_login(@heir)
        api_post "/api/v1/diaries/#{@diary.id}/comments",
                 params: { diary_comment: { comment: 'すばらしい' } }
        assert_response :created
        assert_equal 'すばらしい', json.dig('comment', 'comment')
        assert_equal 'InteractionHeir', json.dig('comment', 'name')
        assert_equal 1, json['commentCount']
      end

      test 'POST /diaries/:id/comments — 空コメントは 422' do
        api_login(@heir)
        api_post "/api/v1/diaries/#{@diary.id}/comments",
                 params: { diary_comment: { comment: '' } }
        assert_response :unprocessable_content
        assert json.dig('error', 'details').any?
      end

      test 'POST /diaries/:id/comments — 100文字超は 422' do
        api_login(@heir)
        api_post "/api/v1/diaries/#{@diary.id}/comments",
                 params: { diary_comment: { comment: 'あ' * 101 } }
        assert_response :unprocessable_content
      end

      test 'POST /diaries/:id/comments — 未ログインは 401' do
        api_post "/api/v1/diaries/#{@diary.id}/comments",
                 params: { diary_comment: { comment: 'x' } }
        assert_response :unauthorized
      end
    end
  end
end
