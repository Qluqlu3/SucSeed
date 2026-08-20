require 'test_helper'

module Api
  module V1
    # アピール（後継者 → 職人 への応募）
    class AppealsControllerTest < ApiTestCase
      setup do
        @creator = build_creator('AppealCreator')
        @heir = build_heir('AppealHeir')
      end

      # ── 応募する ──────────────────────────────────────────────────

      test 'POST /api/v1/appeals — 後継者が職人に応募できる' do
        api_login(@heir)
        api_post '/api/v1/appeals', params: { creator_id: @creator.id }
        assert_response :created
        assert_equal @heir.id,    json['heirUserId']
        assert_equal @creator.id, json['creatorUserId']
        assert_equal false, json['isScout']
        assert Match.exists?(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)
      end

      test 'POST /api/v1/appeals — 職人は応募できず 403' do
        other = build_creator('AppealCreator2')

        api_login(@creator)
        api_post '/api/v1/appeals', params: { creator_id: other.id }
        assert_response :forbidden
      end

      test 'POST /api/v1/appeals — 同じ相手への二重応募は 422' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)

        api_login(@heir)
        api_post '/api/v1/appeals', params: { creator_id: @creator.id }
        assert_response :unprocessable_content
      end

      test 'POST /api/v1/appeals — 未ログインは 401' do
        api_post '/api/v1/appeals', params: { creator_id: @creator.id }
        assert_response :unauthorized
      end

      # ── 一覧 ──────────────────────────────────────────────────────

      test 'GET /api/v1/appeals — 職人には自分宛の未回答応募が返る' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)
        # 回答済みは未回答一覧に出さない
        answered_heir = build_heir('AnsweredHeir')
        Match.create!(user_id: answered_heir.id, target_user_id: @creator.id, is_scout: false,
                      is_ok: true)

        api_login(@creator)
        api_get '/api/v1/appeals'
        assert_response :success
        assert_equal [@heir.id], json['items'].pluck('heirUserId')
      end

      test 'GET /api/v1/appeals — 後継者には自分が送った応募が返る' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)

        api_login(@heir)
        api_get '/api/v1/appeals'
        assert_equal [@creator.id], json['items'].pluck('creatorUserId')
        assert_equal 'AppealCreator工房', json['items'].first['creatorTitle']
      end

      test 'GET /api/v1/appeals — スカウトは含まれない' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)

        api_login(@creator)
        api_get '/api/v1/appeals'
        assert_empty json['items']
      end

      # ── 回答する ──────────────────────────────────────────────────

      test 'PATCH /api/v1/appeals/:id — 職人が承諾できる' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)

        api_login(@creator)
        api_patch "/api/v1/appeals/#{@heir.id}", params: { accepted: true }
        assert_response :success
        assert_equal true, json['isOk']
        assert Match.find_by(user_id: @heir.id, target_user_id: @creator.id).is_ok
      end

      test 'PATCH /api/v1/appeals/:id — 職人が辞退できる' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)

        api_login(@creator)
        api_patch "/api/v1/appeals/#{@heir.id}", params: { accepted: false }
        assert_response :success
        assert_equal false, json['isOk']
      end

      test 'PATCH /api/v1/appeals/:id — 後継者は回答できず 403' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)

        api_login(@heir)
        api_patch "/api/v1/appeals/#{@heir.id}", params: { accepted: true }
        assert_response :forbidden
      end

      test 'PATCH /api/v1/appeals/:id — 自分宛でない応募には回答できず 404' do
        other_creator = build_creator('OtherAppealCr')
        Match.create!(user_id: @heir.id, target_user_id: other_creator.id, is_scout: false)

        api_login(@creator)
        api_patch "/api/v1/appeals/#{@heir.id}", params: { accepted: true }
        assert_response :not_found
        assert_nil Match.find_by(user_id: @heir.id, target_user_id: other_creator.id).is_ok
      end

      test 'PATCH /api/v1/appeals/:id — accepted 欠落は 400' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)

        api_login(@creator)
        api_patch "/api/v1/appeals/#{@heir.id}", params: {}
        assert_response :bad_request
      end
    end
  end
end
