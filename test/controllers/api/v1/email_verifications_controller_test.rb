require 'test_helper'

module Api
  module V1
    class EmailVerificationsControllerTest < ApiTestCase
      setup do
        @user = users(:unverified)
      end

      test 'GET /api/v1/email_verifications/:token — 認証画面に出す名前を返す' do
        api_get "/api/v1/email_verifications/#{@user.email_verification_token}"
        assert_response :success
        assert_equal 'Unverified', json['userName']
      end

      test 'GET /api/v1/email_verifications/:token — 不正なトークンは 404（invalid_token）' do
        api_get '/api/v1/email_verifications/nonexistent_token_xxx'
        assert_response :not_found
        assert_equal 'invalid_token', error_code
        assert_equal I18n.t('flash.danger.email_token_invalid'), json.dig('error', 'message')
      end

      test 'PATCH /api/v1/email_verifications/:token — 認証して 204' do
        api_patch "/api/v1/email_verifications/#{@user.email_verification_token}"
        assert_response :no_content
        assert @user.reload.is_certified?
      end

      test 'PATCH /api/v1/email_verifications/:token — 期限切れなら 404 で認証しない' do
        token = @user.email_verification_token
        travel 25.hours
        api_patch "/api/v1/email_verifications/#{token}"
        assert_response :not_found
        assert_not @user.reload.is_certified?
      end

      test 'PATCH /api/v1/email_verifications/:token — 送信後にメールアドレスを変えると古いリンクは無効' do
        token = @user.email_verification_token
        @user.update!(email: 'changed@example.com')
        api_patch "/api/v1/email_verifications/#{token}"
        assert_response :not_found
      end

      test 'PATCH /api/v1/email_verifications/:token — 認証済みなら 409（already_certified）' do
        api_patch "/api/v1/email_verifications/#{users(:alice).email_verification_token}"
        assert_response :conflict
        assert_equal 'already_certified', error_code
      end
    end
  end
end
