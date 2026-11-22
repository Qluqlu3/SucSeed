require 'test_helper'

module Api
  module V1
    class RegistrationsControllerTest < ApiTestCase
      setup do
        ActionMailer::Base.deliveries.clear
      end

      def valid_user_params(**overrides)
        {
          name: 'NewUser', email: 'NewUser@Example.com', birthday: '1990-04-05',
          is_man: false, is_creator: true,
          password: 'password123', password_confirmation: 'password123'
        }.merge(overrides)
      end

      test 'POST /api/v1/registration — 登録して 201・認証メールを送る・ログインはしない' do
        assert_difference 'User.count', 1 do
          api_post '/api/v1/registration', params: { user: valid_user_params }
        end
        assert_response :created
        assert_equal 'newuser@example.com', json['email']

        user = User.find_by!(email: 'newuser@example.com')
        assert_equal Date.new(1990, 4, 5), user.birthday
        assert user.is_creator?
        assert_not user.is_man?
        assert_not user.is_certified?

        assert_equal 1, ActionMailer::Base.deliveries.count
        assert_equal ['newuser@example.com'], ActionMailer::Base.deliveries.last.to
        assert_nil session[:id]
      end

      test 'POST /api/v1/registration — アバター画像を multipart で付けられる' do
        api_post_multipart '/api/v1/registration',
                           params: { user: valid_user_params(avatar_path: upload_fixture) }
        assert_response :created
        assert User.find_by!(email: 'newuser@example.com').avatar_path.present?
      end

      test 'POST /api/v1/registration — アバターを文字列で送ると 400（not_multipart）' do
        assert_no_difference 'User.count' do
          api_post '/api/v1/registration', params: { user: valid_user_params(avatar_path: 'x.png') }
        end
        assert_response :bad_request
        assert_equal 'not_multipart', error_code
      end

      test 'POST /api/v1/registration — 入力が不正なら 422 で理由を返し、メールは送らない' do
        assert_no_difference 'User.count' do
          api_post '/api/v1/registration',
                   params: { user: valid_user_params(name: '', password_confirmation: 'mismatch1') }
        end
        assert_response :unprocessable_content
        assert_equal 'unprocessable_entity', error_code
        assert_operator json.dig('error', 'details').size, :>=, 2
        assert_equal 0, ActionMailer::Base.deliveries.count
      end

      test 'POST /api/v1/registration — 登録済みのメールアドレスは 422' do
        assert_no_difference 'User.count' do
          api_post '/api/v1/registration',
                   params: { user: valid_user_params(email: users(:alice).email) }
        end
        assert_response :unprocessable_content
      end

      test 'POST /api/v1/registration — user が無ければ 400' do
        api_post '/api/v1/registration'
        assert_response :bad_request
      end
    end
  end
end
