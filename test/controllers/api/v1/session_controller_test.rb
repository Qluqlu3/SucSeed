require 'test_helper'

module Api
  module V1
    class SessionControllerTest < ApiTestCase
      setup do
        @user    = users(:alice)
        @creator = users(:creator_bob)
      end

      # ── GET: 未ログイン ───────────────────────────────────────────

      test 'GET /api/v1/session — 未ログイン: role=guest, loggedIn=false' do
        api_get '/api/v1/session'
        assert_response :success
        assert_equal 'guest', json['role']
        assert_equal false,   json['loggedIn']
        assert_nil json['userId']
      end

      test 'GET /api/v1/session — csrfToken が含まれる' do
        api_get '/api/v1/session'
        assert json['csrfToken'].present?
      end

      test 'GET /api/v1/session — artCategories が配列で返る' do
        api_get '/api/v1/session'
        assert_kind_of Array, json['artCategories']
      end

      test 'GET /api/v1/session — layoutAssets が logoSrc / titleSrc を含む' do
        api_get '/api/v1/session'
        assert json.dig('layoutAssets', 'logoSrc').present?
        assert json.dig('layoutAssets', 'titleSrc').present?
      end

      # ── GET: ログイン済み ────────────────────────────────────────

      test 'GET /api/v1/session — ログイン中: role=user, loggedIn=true' do
        log_in_as(@user)
        api_get '/api/v1/session'
        assert_response :success
        assert_equal 'user',   json['role']
        assert_equal true,     json['loggedIn']
        assert_equal @user.id, json['userId']
      end

      test 'GET /api/v1/session — クリエイターログイン: role=creator' do
        log_in_as(@creator)
        api_get '/api/v1/session'
        assert_equal 'creator', json['role']
      end

      test 'GET /api/v1/session — heirs レコードを持つユーザーは role=heir' do
        heir = build_heir('ApiHeir')
        log_in_as(heir)
        api_get '/api/v1/session'
        assert_equal 'heir', json['role']
      end

      test 'GET /api/v1/session — タイムアウト後は 401' do
        log_in_as(@user)
        travel_to 3.hours.from_now do
          api_get '/api/v1/session'
          assert_response :unauthorized
          assert_equal 'session_expired', error_code
        end
      end

      # ── POST: ログイン ───────────────────────────────────────────

      test 'POST /api/v1/session — 正しい認証情報で 201 とセッション情報が返る' do
        api_login(@user)
        assert_response :created
        assert_equal true,     json['loggedIn']
        assert_equal @user.id, json['userId']
        assert_equal @user.id, session[:id]
      end

      test 'POST /api/v1/session — ログイン時刻が記録される' do
        assert_nil @user.reload.login_time
        api_login(@user)
        assert_not_nil @user.reload.login_time
      end

      test 'POST /api/v1/session — パスワード不一致は 401 / invalid_credentials' do
        api_login(@user, password: 'wrongpassword')
        assert_response :unauthorized
        assert_equal 'invalid_credentials', error_code
        assert_nil session[:id]
      end

      test 'POST /api/v1/session — 存在しないメールアドレスもパスワード不一致と同じ応答' do
        api_post '/api/v1/session',
                 params: { session: { email: 'nobody@example.com', password: 'password123' } }
        assert_response :unauthorized
        assert_equal 'invalid_credentials', error_code
      end

      test 'POST /api/v1/session — session パラメータ欠落は 400' do
        api_post '/api/v1/session', params: {}
        assert_response :bad_request
        assert_equal 'bad_request', error_code
      end

      test 'POST /api/v1/session — ログイン時にセッションIDが再生成される(セッション固定化対策)' do
        api_get '/api/v1/session'
        api_login(@user)
        assert_response :created
        # reset_session を経ているので、ログイン前のセッションの値は引き継がれない
        assert_equal @user.id, session[:id]
      end

      # ── DELETE: ログアウト ───────────────────────────────────────

      test 'DELETE /api/v1/session — ログアウトでセッションが破棄される' do
        log_in_as(@user)
        api_delete '/api/v1/session'
        assert_response :success
        assert_equal false, json['loggedIn']
        assert_equal 'guest', json['role']
        assert_nil session[:id]
      end

      test 'DELETE /api/v1/session — 未ログインでも 401 にならない(冪等)' do
        api_delete '/api/v1/session'
        assert_response :success
        assert_equal false, json['loggedIn']
      end

      # ── 論理削除されたユーザー ───────────────────────────────────

      test 'ログイン後にユーザーが論理削除されるとセッションが破棄される' do
        log_in_as(@user)
        @user.soft_delete

        api_get '/api/v1/session'
        assert_response :success
        assert_equal 'guest', json['role']
        assert_nil session[:id]
      end
    end
  end
end
