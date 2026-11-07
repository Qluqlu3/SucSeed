require 'test_helper'

class AdminControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = admins(:alice_admin)
  end

  # ── 管理者ログイン ─────────────────────────────────────────────────

  test 'POST /admin/login — 正しい認証情報で session[:admin] がセット' do
    post '/admin/login', params: { admin: { user_id: @admin.user_id, password: 'adminpass1' } }
    assert_redirected_to '/admin/index'
    assert_equal @admin.id, session[:admin]
  end

  test 'POST /admin/login — パスワード不一致で session[:admin] 未設定・flash danger' do
    post '/admin/login', params: { admin: { user_id: @admin.user_id, password: 'wrongpass' } }
    assert_response :ok
    assert_nil session[:admin]
    assert_match I18n.t('flash.danger.admin_login_failed'), flash[:danger]
  end

  test 'POST /admin/login — 存在しない user_id でセッション未設定' do
    post '/admin/login', params: { admin: { user_id: 'nonexistent', password: 'adminpass1' } }
    assert_response :ok
    assert_nil session[:admin]
  end

  test 'POST /admin/login — admin パラメータが無くても 500 にならない' do
    post '/admin/login'
    assert_redirected_to '/index'
    assert_nil session[:admin]
  end

  test 'POST /admin/login — user_id だけ欠けていても 500 にならない' do
    post '/admin/login', params: { admin: { password: 'adminpass1' } }
    assert_response :ok
    assert_nil session[:admin]
  end

  test 'POST /admin/login — 既にログイン済みなら何もしない（session 変わらない）' do
    post '/admin/login', params: { admin: { user_id: @admin.user_id, password: 'adminpass1' } }
    current_admin = session[:admin]
    post '/admin/login', params: { admin: { user_id: @admin.user_id, password: 'adminpass1' } }
    assert_equal current_admin, session[:admin]
  end

  # ── 管理者セッション保護 ────────────────────────────────────────────

  test 'GET /admin/index — 未ログインで /admin/login へリダイレクト' do
    get '/admin/index'
    assert_redirected_to '/admin/login'
  end

  test 'GET /admin/management/user — 未ログインで /admin/login へリダイレクト' do
    get '/admin/management/user'
    assert_redirected_to '/admin/login'
  end

  # ── ログアウト・セッションの期限 ───────────────────────────────────

  def log_in_as_admin
    post '/admin/login', params: { admin: { user_id: @admin.user_id, password: 'adminpass1' } }
  end

  test 'POST /admin/logout — 管理者のセッションが消え、管理画面に入れなくなる' do
    log_in_as_admin
    post '/admin/logout'
    assert_redirected_to '/admin/login'
    assert_nil session[:admin]
    assert_equal I18n.t('flash.success.logout'), flash[:success]

    get '/admin/index'
    assert_redirected_to '/admin/login'
  end

  test 'POST /admin/logout — 一般ユーザーとしてのログインは残る' do
    user = User.create!(name: 'BothLogin', email: 'both-login@example.com', password: 'password123',
                        password_confirmation: 'password123', birthday: '1990-01-01', is_man: true)
    post '/user/login', params: { session: { email: user.email, password: 'password123' } }
    log_in_as_admin
    post '/admin/logout'
    assert_equal user.id, session[:id]
  end

  test '管理画面 — 最終操作から30分以内なら操作のたびに期限が延びる' do
    log_in_as_admin
    travel 20.minutes
    get '/admin/index'
    assert_response :success
    travel 20.minutes
    get '/admin/index'
    assert_response :success
  end

  test '管理画面 — 最終操作から30分を過ぎるとログイン画面へ戻され、セッションも消える' do
    log_in_as_admin
    travel 31.minutes
    get '/admin/index'
    assert_redirected_to '/admin/login'
    assert_equal I18n.t('flash.danger.session_expired'), flash[:danger]
    assert_nil session[:admin]
  end
end
