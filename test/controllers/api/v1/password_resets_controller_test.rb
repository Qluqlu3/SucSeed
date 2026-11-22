require 'test_helper'

module Api
  module V1
    class PasswordResetsControllerTest < ApiTestCase
      setup do
        @user = users(:alice)
        ActionMailer::Base.deliveries.clear
      end

      # ── メール送信 ───────────────────────────────────────────────

      test 'POST /api/v1/password_resets — 登録済みのメールアドレスなら 202 でメールを送る' do
        api_post '/api/v1/password_resets', params: { email: " #{@user.email.upcase} " }
        assert_response :accepted
        assert_equal [@user.email], ActionMailer::Base.deliveries.last.to
      end

      test 'POST /api/v1/password_resets — 未登録でも同じ 202（登録の有無を漏らさない）' do
        api_post '/api/v1/password_resets', params: { email: 'nobody@example.com' }
        assert_response :accepted
        assert_equal 0, ActionMailer::Base.deliveries.count
      end

      test 'POST /api/v1/password_resets — メールの送信に失敗しても同じ 202' do
        # 送信の失敗を起こすため、このテストの間だけメーラーを差し替える
        GmailMailer.define_singleton_method(:send_password_reset) { |_user| raise Net::SMTPFatalError, 'boom' }
        api_post '/api/v1/password_resets', params: { email: @user.email }
        assert_response :accepted
      ensure
        GmailMailer.singleton_class.remove_method(:send_password_reset)
      end

      test 'POST /api/v1/password_resets — 空なら 422' do
        api_post '/api/v1/password_resets', params: { email: '' }
        assert_response :unprocessable_content
        assert_equal I18n.t('flash.danger.email_blank'), json.dig('error', 'message')
      end

      # ── リンクの確認 ─────────────────────────────────────────────

      test 'GET /api/v1/password_resets/:token — 有効なら 204' do
        api_get "/api/v1/password_resets/#{@user.password_reset_token}"
        assert_response :no_content
      end

      test 'GET /api/v1/password_resets/:token — 不正・期限切れは 404（invalid_token）' do
        api_get '/api/v1/password_resets/invalid_token_xyz'
        assert_response :not_found
        assert_equal 'invalid_token', error_code
        assert_equal I18n.t('flash.danger.invalid_link'), json.dig('error', 'message')

        token = @user.password_reset_token
        travel 2.hours
        api_get "/api/v1/password_resets/#{token}"
        assert_response :not_found
      end

      # ── 変更 ─────────────────────────────────────────────────────

      def reset(token, password, confirmation = password)
        api_patch "/api/v1/password_resets/#{token}",
                  params: { user: { password: password, password_confirmation: confirmation } }
      end

      test 'PATCH /api/v1/password_resets/:token — パスワードを変えて 204、同じリンクは二度使えない' do
        token = @user.password_reset_token
        reset(token, 'newpass99')
        assert_response :no_content
        assert @user.reload.authenticate('newpass99')

        reset(token, 'another99')
        assert_response :not_found
        assert @user.reload.authenticate('newpass99')
      end

      test 'PATCH /api/v1/password_resets/:token — 確認と一致しない・短いなら 422 で変えない' do
        token = @user.password_reset_token
        reset(token, 'newpass99', 'different9')
        assert_response :unprocessable_content
        reset(token, 'short')
        assert_response :unprocessable_content
        assert @user.reload.authenticate('password123')
      end

      test 'PATCH /api/v1/password_resets/:token — 空のパスワードは成功扱いにせず 422' do
        reset(@user.password_reset_token, '')
        assert_response :unprocessable_content
        assert_includes json.dig('error', 'details'), 'パスワードを入力してください'
      end

      test 'PATCH /api/v1/password_resets/:token — 不正なトークンなら 404' do
        reset('invalid_token_xyz', 'newpass99')
        assert_response :not_found
      end
    end
  end
end
