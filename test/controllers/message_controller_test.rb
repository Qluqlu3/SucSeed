require 'test_helper'

# MessageController は before_action :require_login を持つ
# → 未認証アクセスの振る舞いと、セッションタイムアウトを集中的にテストする
class MessageControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:alice)
  end

  # ── require_login ──────────────────────────────────────────────────

  test '未ログインで GET /message/list → /index へリダイレクト' do
    get '/message/list'
    assert_redirected_to '/index'
    follow_redirect!
    assert_match I18n.t('flash.danger.require_login'), flash[:danger]
  end

  test '未ログインで GET /message/list (JSON) → 401' do
    get '/message/list', as: :json
    assert_response :unauthorized
  end

  test 'ログイン済みで GET /message/list → リダイレクトしない' do
    log_in_as(@user)
    get '/message/list'
    assert_response :success
  end

  # ── セッションタイムアウト ─────────────────────────────────────────

  test 'ログイン後 3 時間経過でアクセスすると /index へリダイレクト' do
    log_in_as(@user)
    travel_to 3.hours.from_now do
      get '/message/list'
      assert_redirected_to '/index'
      follow_redirect!
      assert_match I18n.t('flash.danger.session_expired'), flash[:danger]
    end
  end

  test 'セッションタイムアウト後の JSON リクエスト → 401' do
    log_in_as(@user)
    travel_to 3.hours.from_now do
      get '/message/list', as: :json
      assert_response :unauthorized
    end
  end

  test 'ログイン後 1 時間以内はタイムアウトしない' do
    log_in_as(@user)
    travel_to 1.hour.from_now do
      get '/message/list'
      assert_response :success
    end
  end

  # ── last_active_at の更新 ──────────────────────────────────────────

  # ── メッセージ送信 ───────────────────────────────────────────────────

  test 'POST /message/send/:id — 送信後の履歴ページが表示され、古い順に並ぶ' do
    partner = users(:creator_bob)
    MessageList.create!(creator_user_id: partner.id, heir_user_id: @user.id)
    Message.create!(send_user_id: partner.id, receive_user_id: @user.id, content: 'first',
                    created_at: 1.hour.ago)
    log_in_as(@user)

    post "/message/send/#{partner.id}", params: { message: { content: 'second' } }
    assert_redirected_to "/message/history/#{partner.id}"
    follow_redirect!

    assert_response :success
    props = JSON.parse(response.parsed_body.at_css('[data-props]')['data-props'])
    assert_equal %w[first second], props['messageHistory'].pluck('content')
    assert_equal default_avatar_path, props['toUser']['avatarPath']
    assert_equal default_avatar_path, props['messageLists'].first['avatarPath']
  end

  test 'リクエストのたびに session[:last_active_at] が更新される' do
    log_in_as(@user)
    first_active_at = session[:last_active_at]
    travel_to 10.minutes.from_now do
      get '/message/list'
      assert session[:last_active_at] > first_active_at
    end
  end
end
