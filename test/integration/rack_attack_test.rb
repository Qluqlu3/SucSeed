require 'test_helper'

# Rack::Attack レートリミットの統合テスト
# 各テスト前にキャッシュをクリアしてスロットル状態をリセットする
class RackAttackTest < ActionDispatch::IntegrationTest
  setup do
    Rails.cache.clear
  end

  # ── ログインスロットル (5 回/分) ──────────────────────────────────

  test 'ログイン 5 回目まで 200/302 が返る' do
    5.times do
      post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                          headers: { 'REMOTE_ADDR' => '1.2.3.4' }
      assert_not_equal 429, response.status, "#{response.status} が返った（5 回目以内で 429 は誤り）"
    end
  end

  test 'ログイン 6 回目で 429 が返る' do
    5.times do
      post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                          headers: { 'REMOTE_ADDR' => '2.3.4.5' }
    end
    post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                        headers: { 'REMOTE_ADDR' => '2.3.4.5' }
    assert_equal 429, response.status
  end

  test '別の IP からのログインはスロットルされない' do
    5.times do
      post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                          headers: { 'REMOTE_ADDR' => '3.4.5.6' }
    end
    post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                        headers: { 'REMOTE_ADDR' => '9.9.9.9' }
    assert_not_equal 429, response.status
  end

  # ── パスワードリセットスロットル (5 回/時間) ──────────────────────

  test 'パスワードリセット 6 回目で 429 が返る' do
    5.times do
      post '/user/password_forgot', params: { user_email: { email: 'x@x.com' } },
                                    headers: { 'REMOTE_ADDR' => '4.5.6.7' }
    end
    post '/user/password_forgot', params: { user_email: { email: 'x@x.com' } },
                                  headers: { 'REMOTE_ADDR' => '4.5.6.7' }
    assert_equal 429, response.status
  end

  # ── 管理者ログインスロットル (5 回/分) ────────────────────────────

  test '管理者ログイン 6 回目で 429 が返る' do
    5.times do
      post '/admin/login', params: { admin: { user_id: 'x', password: 'wrong' } },
                           headers: { 'REMOTE_ADDR' => '5.6.7.8' }
    end
    post '/admin/login', params: { admin: { user_id: 'x', password: 'wrong' } },
                         headers: { 'REMOTE_ADDR' => '5.6.7.8' }
    assert_equal 429, response.status
  end
end
