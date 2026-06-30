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
end
