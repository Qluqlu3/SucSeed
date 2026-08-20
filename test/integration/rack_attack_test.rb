require 'test_helper'

# Rack::Attack レートリミットの統合テスト
# キャッシュのクリアは test_helper.rb の共通 setup で行われる
#
# Rack::Attack のスロットルは実時刻を period で割った固定ウィンドウでカウントするため、
# リクエストのループ中に時刻が次のウィンドウへ切り替わると本来のリクエスト回数を
# 数えきれず期待通りに 429 が返らないことがある。freeze_time で時刻を固定し、
# テストの実行タイミングに依存しないようにする。
class RackAttackTest < ActionDispatch::IntegrationTest
  # ── ログインスロットル (5 回/分) ──────────────────────────────────

  test 'ログイン 5 回目まで 200/302 が返る' do
    freeze_time do
      5.times do
        post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                            headers: { 'REMOTE_ADDR' => '1.2.3.4' }
        assert_not_equal 429, response.status, "#{response.status} が返った（5 回目以内で 429 は誤り）"
      end
    end
  end

  test 'ログイン 6 回目で 429 が返る' do
    freeze_time do
      5.times do
        post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                            headers: { 'REMOTE_ADDR' => '2.3.4.5' }
      end
      post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                          headers: { 'REMOTE_ADDR' => '2.3.4.5' }
      assert_equal 429, response.status
    end
  end

  test '別の IP からのログインはスロットルされない' do
    freeze_time do
      5.times do
        post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                            headers: { 'REMOTE_ADDR' => '3.4.5.6' }
      end
      post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                          headers: { 'REMOTE_ADDR' => '9.9.9.9' }
      assert_not_equal 429, response.status
    end
  end

  # ── パスワードリセットスロットル (5 回/時間) ──────────────────────

  test 'パスワードリセット 6 回目で 429 が返る' do
    freeze_time do
      5.times do
        post '/user/password_forgot', params: { user_email: { email: 'x@x.com' } },
                                      headers: { 'REMOTE_ADDR' => '4.5.6.7' }
      end
      post '/user/password_forgot', params: { user_email: { email: 'x@x.com' } },
                                    headers: { 'REMOTE_ADDR' => '4.5.6.7' }
      assert_equal 429, response.status
    end
  end

  # ── 管理者ログインスロットル (5 回/分) ────────────────────────────

  test '管理者ログイン 6 回目で 429 が返る' do
    freeze_time do
      5.times do
        post '/admin/login', params: { admin: { user_id: 'x', password: 'wrong' } },
                             headers: { 'REMOTE_ADDR' => '5.6.7.8' }
      end
      post '/admin/login', params: { admin: { user_id: 'x', password: 'wrong' } },
                           headers: { 'REMOTE_ADDR' => '5.6.7.8' }
      assert_equal 429, response.status
    end
  end

  # ── 投稿系スロットル（スパム対策） ────────────────────────────────

  test '日記投稿 11 回目で 429 が返る' do
    freeze_time do
      10.times do
        post '/diary/post', params: { diary: { content: 'テスト' } },
                            headers: { 'REMOTE_ADDR' => '6.6.6.6' }
      end
      post '/diary/post', params: { diary: { content: 'テスト' } },
                          headers: { 'REMOTE_ADDR' => '6.6.6.6' }
      assert_equal 429, response.status
    end
  end

  test '日記コメント 21 回目で 429 が返る' do
    freeze_time do
      20.times do
        post '/diary/show/dummy_id/comment', params: { diary_comment: { comment: 'テスト' } },
                                             headers: { 'REMOTE_ADDR' => '7.7.7.7' }
      end
      post '/diary/show/dummy_id/comment', params: { diary_comment: { comment: 'テスト' } },
                                           headers: { 'REMOTE_ADDR' => '7.7.7.7' }
      assert_equal 429, response.status
    end
  end

  test 'ギャラリー投稿 11 回目で 429 が返る' do
    freeze_time do
      10.times do
        post '/gallery/view', params: { gallery: { comment: 'テスト' } },
                              headers: { 'REMOTE_ADDR' => '8.8.8.8' }
      end
      post '/gallery/view', params: { gallery: { comment: 'テスト' } },
                            headers: { 'REMOTE_ADDR' => '8.8.8.8' }
      assert_equal 429, response.status
    end
  end

  test 'ギャラリーコメント 21 回目で 429 が返る' do
    freeze_time do
      20.times do
        post '/gallery/selected/comment/dummy_id', params: { gallery_comment: { comment: 'テスト' } },
                                                   headers: { 'REMOTE_ADDR' => '9.9.8.8' }
      end
      post '/gallery/selected/comment/dummy_id', params: { gallery_comment: { comment: 'テスト' } },
                                                 headers: { 'REMOTE_ADDR' => '9.9.8.8' }
      assert_equal 429, response.status
    end
  end

  test 'メッセージ送信 31 回目で 429 が返る' do
    freeze_time do
      30.times do
        post '/message/send/dummy_id', params: { message: { content: 'テスト' } },
                                       headers: { 'REMOTE_ADDR' => '10.10.10.10' }
      end
      post '/message/send/dummy_id', params: { message: { content: 'テスト' } },
                                     headers: { 'REMOTE_ADDR' => '10.10.10.10' }
      assert_equal 429, response.status
    end
  end

  test '投稿系スロットルは制限内なら 429 にならない' do
    freeze_time do
      9.times do
        post '/diary/post', params: { diary: { content: 'テスト' } },
                            headers: { 'REMOTE_ADDR' => '11.11.11.11' }
        assert_not_equal 429, response.status
      end
    end
  end

  # ── JSON API 側も同じスロットルに乗ること ────────────────────────
  # HTML 版だけ絞っていると API 経由で素通しできてしまうため、
  # 主要な書き込みエンドポイントについて API 側も検証する。

  test 'API ログイン (POST /api/v1/session) 6 回目で 429 が返る' do
    freeze_time do
      6.times do
        post '/api/v1/session', params: { session: { email: 'x@x.com', password: 'wrong' } },
                                headers: { 'REMOTE_ADDR' => '12.12.12.12' }, as: :json
      end
      assert_equal 429, response.status
    end
  end

  test 'API ログインの 429 は JSON のエラーエンベロープで返る' do
    freeze_time do
      6.times do
        post '/api/v1/session', params: { session: { email: 'x@x.com', password: 'wrong' } },
                                headers: { 'REMOTE_ADDR' => '13.13.13.13' }, as: :json
      end
      assert_equal 429, response.status
      assert_equal 'too_many_requests', response.parsed_body.dig('error', 'code')
    end
  end

  test 'HTML ログインと API ログインは同じカウンタを共有する' do
    freeze_time do
      3.times do
        post '/user/login', params: { session: { email: 'x@x.com', password: 'wrong' } },
                            headers: { 'REMOTE_ADDR' => '14.14.14.14' }
      end
      3.times do
        post '/api/v1/session', params: { session: { email: 'x@x.com', password: 'wrong' } },
                                headers: { 'REMOTE_ADDR' => '14.14.14.14' }, as: :json
      end
      assert_equal 429, response.status
    end
  end

  test 'API 日記投稿 (POST /api/v1/diaries) 11 回目で 429 が返る' do
    freeze_time do
      11.times do
        post '/api/v1/diaries', params: { diary: { content: 'テスト' } },
                                headers: { 'REMOTE_ADDR' => '15.15.15.15' }, as: :json
      end
      assert_equal 429, response.status
    end
  end

  test 'API 日記コメント 21 回目で 429 が返る' do
    freeze_time do
      21.times do
        post '/api/v1/diaries/dummy_id/comments', params: { diary_comment: { comment: 'テスト' } },
                                                  headers: { 'REMOTE_ADDR' => '16.16.16.16' },
                                                  as: :json
      end
      assert_equal 429, response.status
    end
  end

  test 'API ギャラリーコメント 21 回目で 429 が返る' do
    freeze_time do
      21.times do
        post '/api/v1/galleries/dummy_id/comments',
             params: { gallery_comment: { comment: 'テスト' } },
             headers: { 'REMOTE_ADDR' => '17.17.17.17' }, as: :json
      end
      assert_equal 429, response.status
    end
  end

  test 'API メッセージ送信 31 回目で 429 が返る' do
    freeze_time do
      31.times do
        post '/api/v1/message_threads/dummy_id/messages',
             params: { message: { content: 'テスト' } },
             headers: { 'REMOTE_ADDR' => '18.18.18.18' }, as: :json
      end
      assert_equal 429, response.status
    end
  end

  test 'API アピール送信 31 回目で 429 が返る' do
    freeze_time do
      31.times do
        post '/api/v1/appeals', params: { creator_id: 'dummy_id' },
                                headers: { 'REMOTE_ADDR' => '19.19.19.19' }, as: :json
      end
      assert_equal 429, response.status
    end
  end
end
