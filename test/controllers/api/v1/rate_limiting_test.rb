require 'test_helper'

module Api
  module V1
    # ユーザー単位のレート制限（Rails 8 の ActionController::RateLimiting）。
    #
    # Rack::Attack の IP 単位の制限とは別軸のため、
    # 「同じユーザーなら IP を変えても止まる」「ユーザーが違えば独立して数える」
    # という Rack::Attack では担保できない性質をここで固定する。
    #
    # 【テスト方針】
    # Rack::Attack も同じエンドポイントを IP 単位で見張っており、そちらが先に
    # 発火すると何を検証しているのか分からなくなる。そのためリクエストごとに
    # 別の IP を使い、Rack::Attack が発火しない状況を作ってから
    # ユーザー単位の制限だけを観測する。
    class RateLimitingTest < ApiTestCase
      setup do
        @creator = build_creator('LimitCreator')
        @heir = build_heir('LimitHeir')
      end

      # ── 日記投稿: 10回/10分（ユーザー単位）─────────────────────

      test 'POST /api/v1/diaries — 11回目で 429 / too_many_requests' do
        api_login(@creator)

        10.times { |i| post_diary("日記#{i}") }
        assert_response :created

        post_diary('11件目')
        assert_response :too_many_requests
        assert_equal 'too_many_requests', error_code
      end

      test 'POST /api/v1/diaries — 上限を超えた分は保存されない' do
        api_login(@creator)
        10.times { |i| post_diary("日記#{i}") }

        assert_no_difference 'Diary.count' do
          post_diary('溢れた分')
        end
      end

      test 'POST /api/v1/diaries — 同じユーザーなら IP を変えても止まる' do
        api_login(@creator)

        # 毎回別の IP から投稿しても、ユーザー単位で数えているので止まる
        11.times { |i| post_diary("日記#{i}") }
        assert_response :too_many_requests
      end

      test 'POST /api/v1/diaries — ユーザーが違えば独立して数える' do
        api_login(@creator)
        11.times { |i| post_diary("日記#{i}") }
        assert_response :too_many_requests

        other = build_creator('LimitCreator2')
        api_login(other)
        post_diary('別ユーザーの投稿')
        assert_response :created
      end

      test 'POST /api/v1/diaries — 期間が過ぎればまた投稿できる' do
        api_login(@creator)
        11.times { |i| post_diary("日記#{i}") }
        assert_response :too_many_requests

        travel 11.minutes
        post_diary('期間明けの投稿')
        assert_response :created
      end

      # ── コメント: 20回/5分（ユーザー単位）──────────────────────

      test 'POST /diaries/:id/comments — 21回目で 429' do
        diary = Diary.create!(user_id: @creator.id, content: '日記')
        api_login(@heir)

        21.times do |i|
          post "/api/v1/diaries/#{diary.id}/comments",
               params: { diary_comment: { comment: "コメント#{i}" } },
               headers: next_ip_header, as: :json
        end
        assert_response :too_many_requests
      end

      # ── ログイン: メールアドレス単位で 10回/10分 ─────────────────

      test 'POST /api/v1/session — IP を変えても同一メールアドレスなら止まる(分散総当たり対策)' do
        # Rack::Attack は IP 単位なので、IP を変えられると素通しになる。
        # メールアドレス単位で数えることで狙われている側を守る。
        11.times { attempt_login(@heir.email) }
        assert_response :too_many_requests
        assert_equal 'too_many_requests', error_code
      end

      test 'POST /api/v1/session — 別のメールアドレスは独立して数える' do
        11.times { attempt_login(@heir.email) }
        assert_response :too_many_requests

        # 上限に達した @heir とは別アカウントなので通る（401 = 認証失敗だが 429 ではない）
        attempt_login(@creator.email)
        assert_response :unauthorized
      end

      test 'POST /api/v1/session — 大文字小文字が違っても同じアカウントとして数える' do
        10.times { attempt_login(@heir.email) }

        attempt_login(@heir.email.upcase)
        assert_response :too_many_requests
      end

      test 'POST /api/v1/session — 上限内なら正しい認証情報でログインできる' do
        3.times { attempt_login(@heir.email) }

        attempt_login(@heir.email, password: DEFAULT_PASSWORD)
        assert_response :created
      end

      test 'POST /api/v1/session — session がハッシュでなくてもレート制限で 500 にならない' do
        post '/api/v1/session', params: { session: 'not-a-hash' },
                                headers: next_ip_header, as: :json
        assert_response :bad_request
      end

      private

      # Rack::Attack(IP 単位)を発火させないため、呼ぶたびに別の IP を使う
      def next_ip_header
        @ip_counter = (@ip_counter || 0) + 1
        { 'REMOTE_ADDR' => "203.0.113.#{@ip_counter}" }
      end

      def post_diary(content)
        post '/api/v1/diaries', params: { diary: { content: content } },
                                headers: next_ip_header, as: :json
      end

      def attempt_login(email, password: 'wrongpass')
        post '/api/v1/session', params: { session: { email: email, password: password } },
                                headers: next_ip_header, as: :json
      end
    end
  end
end
