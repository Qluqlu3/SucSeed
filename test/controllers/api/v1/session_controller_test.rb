require 'test_helper'

module Api
  module V1
    class SessionControllerTest < ActionDispatch::IntegrationTest
      setup do
        @user    = users(:alice)
        @creator = users(:creator_bob)
      end

      # ── 未ログイン ─────────────────────────────────────────────────

      test 'GET /api/v1/session — 未ログイン: role=guest, loggedIn=false' do
        get '/api/v1/session', as: :json
        assert_response :success
        json = response.parsed_body
        assert_equal 'guest', json['role']
        assert_equal false,   json['loggedIn']
        assert_nil json['userId']
      end

      test 'GET /api/v1/session — csrfToken が含まれる' do
        get '/api/v1/session', as: :json
        json = response.parsed_body
        assert json['csrfToken'].present?
      end

      test 'GET /api/v1/session — artCategories が配列で返る' do
        get '/api/v1/session', as: :json
        json = response.parsed_body
        assert_kind_of Array, json['artCategories']
      end

      # ── ログイン済み: 一般ユーザー ────────────────────────────────

      test 'GET /api/v1/session — ログイン中: role=user, loggedIn=true' do
        log_in_as(@user)
        get '/api/v1/session', as: :json
        assert_response :success
        json = response.parsed_body
        assert_equal 'user',   json['role']
        assert_equal true,     json['loggedIn']
        assert_equal @user.id, json['userId']
      end

      # ── ログイン済み: クリエイター ────────────────────────────────

      test 'GET /api/v1/session — クリエイターログイン: role=creator' do
        log_in_as(@creator)
        get '/api/v1/session', as: :json
        assert_response :success
        json = response.parsed_body
        assert_equal 'creator', json['role']
      end

      # ── セッションタイムアウト ────────────────────────────────────

      test 'GET /api/v1/session — タイムアウト後は 401' do
        log_in_as(@user)
        travel_to 3.hours.from_now do
          get '/api/v1/session', as: :json
          assert_response :unauthorized
        end
      end

      # ── layoutAssets ─────────────────────────────────────────────

      test 'GET /api/v1/session — layoutAssets が logoSrc / titleSrc を含む' do
        get '/api/v1/session', as: :json
        json = response.parsed_body
        assert json.dig('layoutAssets', 'logoSrc').present?
        assert json.dig('layoutAssets', 'titleSrc').present?
      end
    end
  end
end
