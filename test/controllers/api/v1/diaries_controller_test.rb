require 'test_helper'

module Api
  module V1
    class DiariesControllerTest < ApiTestCase
      setup do
        @creator = build_creator('DiaryCreator')
        @heir = build_heir('DiaryHeir')
      end

      # ── 一覧 ──────────────────────────────────────────────────────

      test 'GET /api/v1/diaries — user_id 指定なし・未ログインは 401' do
        api_get '/api/v1/diaries'
        assert_response :unauthorized
      end

      test 'GET /api/v1/diaries?user_id= — 未ログインでも指定ユーザーの日記が読める' do
        diary = Diary.create!(user_id: @creator.id, content: '公開日記')

        api_get '/api/v1/diaries', params: { user_id: @creator.id }
        assert_response :success
        assert_equal [diary.id], json['items'].pluck('diaryId')
      end

      test 'GET /api/v1/diaries — 自分とお気に入り登録した相手の日記だけが返る' do
        mine = Diary.create!(user_id: @heir.id, content: '自分の日記')
        Favorite.create!(user_id: @heir.id, favorite_user_id: @creator.id)
        favorited = Diary.create!(user_id: @creator.id, content: 'お気に入りの日記')
        stranger = build_creator('StrangerCreator')
        Diary.create!(user_id: stranger.id, content: '無関係な日記')

        api_login(@heir)
        api_get '/api/v1/diaries'
        assert_equal [mine.id, favorited.id].sort, json['items'].pluck('diaryId').sort
      end

      test 'GET /api/v1/diaries — 論理削除された日記は含まれない' do
        visible = Diary.create!(user_id: @creator.id, content: '生きている日記')
        Diary.create!(user_id: @creator.id, content: '消した日記').soft_delete

        api_get '/api/v1/diaries', params: { user_id: @creator.id }
        assert_equal [visible.id], json['items'].pluck('diaryId')
      end

      test 'GET /api/v1/diaries — いいね数・コメント数・自分のいいねが含まれる' do
        diary = Diary.create!(user_id: @creator.id, content: '反応のある日記')
        DiaryGood.create!(diary_id: diary.id, user_id: @heir.id)
        DiaryComment.create!(diary_id: diary.id, user_id: @heir.id, comment: 'いい日記')

        api_login(@heir)
        api_get '/api/v1/diaries', params: { user_id: @creator.id }
        item = json['items'].first
        assert_equal 1, item['goodCount']
        assert_equal 1, item['commentCount']
        assert_equal true, item['myGood']
        assert_equal 'いい日記', item['comments'].first['comment']
        assert_equal 'DiaryHeir', item['comments'].first['name']
      end

      test 'GET /api/v1/diaries — 他人のいいねは myGood に数えない' do
        diary = Diary.create!(user_id: @creator.id, content: '日記')
        other = build_heir('OtherLikerHeir')
        DiaryGood.create!(diary_id: diary.id, user_id: other.id)

        api_login(@heir)
        api_get '/api/v1/diaries', params: { user_id: @creator.id }
        assert_equal 1, json['items'].first['goodCount']
        assert_equal false, json['items'].first['myGood']
      end

      test 'GET /api/v1/diaries — 論理削除されたコメントは含まれない' do
        diary = Diary.create!(user_id: @creator.id, content: '日記')
        DiaryComment.create!(diary_id: diary.id, user_id: @heir.id, comment: '残るコメント')
        DiaryComment.create!(diary_id: diary.id, user_id: @heir.id, comment: '消すコメント').soft_delete

        api_get '/api/v1/diaries', params: { user_id: @creator.id }
        item = json['items'].first
        assert_equal ['残るコメント'], item['comments'].pluck('comment')
        assert_equal 1, item['commentCount']
      end

      # ── 投稿 ──────────────────────────────────────────────────────

      test 'POST /api/v1/diaries — 職人が投稿できる' do
        api_login(@creator)
        api_post '/api/v1/diaries', params: { diary: { content: '新しい日記' } }
        assert_response :created
        assert_equal '新しい日記', json['content']
        assert_equal 'DiaryCreator', json['name']
        assert_equal 0, json['goodCount']
      end

      test 'POST /api/v1/diaries — 後継者は投稿できず 403' do
        api_login(@heir)
        api_post '/api/v1/diaries', params: { diary: { content: '投稿できないはず' } }
        assert_response :forbidden
        assert_equal 'forbidden', error_code
      end

      test 'POST /api/v1/diaries — 未ログインは 401' do
        api_post '/api/v1/diaries', params: { diary: { content: 'x' } }
        assert_response :unauthorized
      end

      test 'POST /api/v1/diaries — content が空なら 422' do
        api_login(@creator)
        api_post '/api/v1/diaries', params: { diary: { content: '' } }
        assert_response :unprocessable_content
        assert json.dig('error', 'details').any?
      end

      test 'POST /api/v1/diaries — diary パラメータ欠落は 400' do
        api_login(@creator)
        api_post '/api/v1/diaries', params: {}
        assert_response :bad_request
        assert_equal 'bad_request', error_code
      end

      # ── 削除 ──────────────────────────────────────────────────────

      test 'DELETE /api/v1/diaries/:id — 自分の日記を論理削除できる' do
        diary = Diary.create!(user_id: @creator.id, content: '消す日記')

        api_login(@creator)
        api_delete "/api/v1/diaries/#{diary.id}"
        assert_response :no_content
        assert Diary.with_deleted.find(diary.id).deleted?
      end

      test 'DELETE /api/v1/diaries/:id — 他人の日記は削除できず 404' do
        diary = Diary.create!(user_id: @creator.id, content: '他人の日記')
        other = build_creator('OtherDiaryCreator')

        api_login(other)
        api_delete "/api/v1/diaries/#{diary.id}"
        assert_response :not_found
        assert_not Diary.with_deleted.find(diary.id).deleted?
      end
    end
  end
end
