require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:alice)
    ActionMailer::Base.deliveries.clear
  end

  # ── ログイン ───────────────────────────────────────────────────────

  test 'POST /user/login — 正しい認証情報でログイン成功・セッションセット' do
    post '/user/login', params: { session: { email: @user.email, password: 'password123' } }
    assert_redirected_to '/index'
    follow_redirect!
    assert_equal @user.id, session[:id]
  end

  test 'POST /user/login — パスワード不一致でセッション未設定・flash danger' do
    post '/user/login', params: { session: { email: @user.email, password: 'wrongpass' } }
    assert_redirected_to '/index'
    assert_nil session[:id]
    follow_redirect!
    assert_match I18n.t('flash.danger.login_failed'), flash[:danger]
  end

  test 'POST /user/login — 存在しないメールでセッション未設定' do
    post '/user/login', params: { session: { email: 'nobody@example.com', password: 'password123' } }
    assert_redirected_to '/index'
    assert_nil session[:id]
  end

  test 'POST /user/login — 既にログイン済みなら何もしない' do
    log_in_as(@user)
    logged_in_session_id = session[:id]
    post '/user/login', params: { session: { email: @user.email, password: 'password123' } }
    assert_equal logged_in_session_id, session[:id]
  end

  # ── ログアウト ─────────────────────────────────────────────────────

  test 'POST /index (logout) — セッションクリアして /index へリダイレクト' do
    log_in_as(@user)
    assert_not_nil session[:id]
    post '/index'
    assert_redirected_to '/index'
    assert_nil session[:id]
  end

  # ── ユーザー登録 ───────────────────────────────────────────────────

  test 'POST /user/create — 有効なパラメータで保存・メール送信・リダイレクト' do
    assert_difference 'User.count', 1 do
      post '/user/create', params: {
        user: {
          name: 'NewUser',
          email: 'newuser@example.com',
          birthday: '1990-01-01',
          is_man: true,
          is_creator: false,
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end
    assert_redirected_to '/index'
    assert_equal 1, ActionMailer::Base.deliveries.count
  end

  test 'POST /user/create — name 空で保存失敗・regist を再描画' do
    assert_no_difference 'User.count' do
      post '/user/create', params: {
        user: {
          name: '',
          email: 'fail@example.com',
          birthday: '1990-01-01',
          is_man: true,
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end
    assert_response :unprocessable_entity
  end

  # ── パスワードリセット ─────────────────────────────────────────────

  test 'POST /user/password_forgot — 空メールで再描画' do
    post '/user/password_forgot', params: { user_email: { email: '' } }
    assert_response :ok
    assert_equal 0, ActionMailer::Base.deliveries.count
  end

  test 'POST /user/password_forgot — 登録済みメールでリダイレクト・メール送信' do
    post '/user/password_forgot', params: { user_email: { email: @user.email } }
    assert_redirected_to '/index'
    assert_equal 1, ActionMailer::Base.deliveries.count
  end

  test 'POST /user/password_forgot — 未登録メールでもリダイレクト（列挙防止）' do
    post '/user/password_forgot', params: { user_email: { email: 'nobody@example.com' } }
    assert_redirected_to '/index'
    assert_equal 0, ActionMailer::Base.deliveries.count
  end

  test 'GET /user/password_reset/:token — 無効トークンで /user/password_forgot へリダイレクト' do
    get '/user/password_reset/invalid_token_xyz'
    assert_redirected_to '/user/password_forgot'
  end

  test 'GET /user/password_reset/:token — 期限切れトークンで /user/password_forgot へリダイレクト' do
    @user.update_columns(
      password_reset_token: 'expired_token_001',
      password_reset_sent_at: 2.hours.ago
    )
    get '/user/password_reset/expired_token_001'
    assert_redirected_to '/user/password_forgot'
  end

  test 'PATCH /user/password_reset/:token — 有効トークンでパスワード変更・セッションクリア' do
    @user.generate_password_reset_token!
    token = @user.reload.password_reset_token
    patch "/user/password_reset/#{token}", params: {
      user: { password: 'newpass99', password_confirmation: 'newpass99' }
    }
    assert_redirected_to '/index'
    assert_nil @user.reload.password_reset_token
  end

  # ── メール認証 ─────────────────────────────────────────────────────

  test 'POST /email/certified/:token — 有効トークンで認証完了' do
    user = users(:unverified)
    post "/email/certified/#{user.email_verification_token}"
    assert_redirected_to '/index'
    assert user.reload.is_certified
  end

  test 'POST /email/certified/:token — 期限切れトークンで flash danger' do
    user = users(:unverified)
    user.update_column(:email_verification_sent_at, 25.hours.ago)
    post "/email/certified/#{user.email_verification_token}"
    assert_redirected_to '/index'
    assert_not user.reload.is_certified
    follow_redirect!
    assert flash[:danger].present?
  end

  test 'POST /email/certified/:token — 無効トークンで flash danger' do
    post '/email/certified/nonexistent_token_xxx'
    assert_redirected_to '/index'
    follow_redirect!
    assert flash[:danger].present?
  end

  test 'POST /email/certified/:token — 認証済みユーザーで flash danger' do
    post '/email/certified/any_token'
    assert_redirected_to '/index'
    follow_redirect!
    assert flash[:danger].present?
  end
end
