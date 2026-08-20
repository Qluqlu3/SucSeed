require 'test_helper'

module Api
  module V1
    # スカウト（職人 → 後継者 への勧誘）
    class ScoutsControllerTest < ApiTestCase
      setup do
        @creator = build_creator('ScoutCreator')
        @heir = build_heir('ScoutHeir')
      end

      test 'POST /api/v1/scouts — 職人が後継者をスカウトできる' do
        api_login(@creator)
        api_post '/api/v1/scouts', params: { heir_id: @heir.id }
        assert_response :created
        assert_equal true,        json['isScout']
        assert_equal @heir.id,    json['heirUserId']
        assert_equal @creator.id, json['creatorUserId']
        assert Match.exists?(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)
      end

      test 'POST /api/v1/scouts — 後継者はスカウトできず 403' do
        api_login(@heir)
        api_post '/api/v1/scouts', params: { heir_id: @heir.id }
        assert_response :forbidden
      end

      test 'GET /api/v1/scouts — 後継者には自分宛の未回答スカウトが返る' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)
        answered_creator = build_creator('AnsweredCr')
        Match.create!(user_id: @heir.id, target_user_id: answered_creator.id, is_scout: true,
                      is_ok: true)

        api_login(@heir)
        api_get '/api/v1/scouts'
        assert_equal [@creator.id], json['items'].pluck('creatorUserId')
      end

      test 'GET /api/v1/scouts — 職人には自分が送ったスカウトが返る' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)

        api_login(@creator)
        api_get '/api/v1/scouts'
        assert_equal [@heir.id], json['items'].pluck('heirUserId')
      end

      test 'PATCH /api/v1/scouts/:id — 後継者が承諾できる' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)

        api_login(@heir)
        api_patch "/api/v1/scouts/#{@creator.id}", params: { accepted: true }
        assert_response :success
        assert_equal true, json['isOk']
      end

      test 'PATCH /api/v1/scouts/:id — 職人は回答できず 403' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)

        api_login(@creator)
        api_patch "/api/v1/scouts/#{@creator.id}", params: { accepted: true }
        assert_response :forbidden
      end

      test 'PATCH /api/v1/scouts/:id — 自分宛でないスカウトは 404' do
        other_heir = build_heir('OtherScoutHeir')
        Match.create!(user_id: other_heir.id, target_user_id: @creator.id, is_scout: true)

        api_login(@heir)
        api_patch "/api/v1/scouts/#{@creator.id}", params: { accepted: true }
        assert_response :not_found
      end

      # ── 成立したマッチング一覧 ────────────────────────────────────

      test 'GET /api/v1/matches — 承諾済みのものだけが返る(職人視点)' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true, is_ok: true)
        pending_heir = build_heir('PendingHeir')
        Match.create!(user_id: pending_heir.id, target_user_id: @creator.id, is_scout: false)

        api_login(@creator)
        api_get '/api/v1/matches'
        assert_response :success
        assert_equal [@heir.id], json['items'].pluck('heirUserId')
      end

      test 'GET /api/v1/matches — 承諾済みのものだけが返る(後継者視点)' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true, is_ok: true)
        rejected_creator = build_creator('RejectedCr')
        Match.create!(user_id: @heir.id, target_user_id: rejected_creator.id, is_scout: false,
                      is_ok: false)

        api_login(@heir)
        api_get '/api/v1/matches'
        assert_equal [@creator.id], json['items'].pluck('creatorUserId')
      end

      test 'GET /api/v1/matches — 未ログインは 401' do
        api_get '/api/v1/matches'
        assert_response :unauthorized
      end
    end
  end
end
