require 'test_helper'

module Api
  module V1
    # テスト環境は CSRF 保護を切っているので、ここでだけ API の保護を有効にして確かめる
    class CsrfProtectionTest < ApiTestCase
      setup do
        @original = Api::BaseController.allow_forgery_protection
        Api::BaseController.allow_forgery_protection = true
      end

      teardown do
        Api::BaseController.allow_forgery_protection = @original
      end

      def log_in(origin:, token: csrf_token)
        credentials = { email: 'alice@example.com', password: 'password123' }
        post '/api/v1/session', params: { session: credentials },
                                headers: { 'X-CSRF-Token' => token, 'Origin' => origin }, as: :json
      end

      def csrf_token
        api_get '/api/v1/session'
        json['csrfToken']
      end

      test '同じオリジンから正しいトークンで送れば通る' do
        log_in(origin: 'http://www.example.com')

        assert_response :created
      end

      test 'トークンが違えば弾く' do
        log_in(origin: 'http://www.example.com', token: 'wrong')

        assert_response :unprocessable_content
        assert_equal 'invalid_authenticity_token', error_code
      end

      test '別オリジンからは、トークンが正しくても弾く' do
        log_in(origin: 'http://evil.example')

        assert_response :unprocessable_content
        assert_equal 'invalid_authenticity_token', error_code
      end
    end
  end
end
