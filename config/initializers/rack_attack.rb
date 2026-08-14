class Rack::Attack
  # --- ログイン ---
  # 同一 IP から 1 分間に 5 回まで
  throttle('login/ip', limit: 5, period: 1.minute) do |req|
    req.ip if req.path == '/user/login' && req.post?
  end

  # 管理者ログイン: 同一 IP から 1 分間に 5 回まで
  throttle('admin_login/ip', limit: 5, period: 1.minute) do |req|
    req.ip if req.path == '/admin/login' && req.post?
  end

  # --- パスワードリセット ---
  # 同一 IP から 1 時間に 5 回まで
  throttle('password_reset/ip', limit: 5, period: 1.hour) do |req|
    req.ip if req.path == '/user/password_forgot' && req.post?
  end

  # --- メール認証 ---
  # 同一 IP から 1 時間に 10 回まで
  throttle('email_certified/ip', limit: 10, period: 1.hour) do |req|
    req.ip if req.path.start_with?('/email/certified/') && req.post?
  end

  # --- 投稿系（スパム対策） ---
  # 日記投稿: 同一 IP から 10 分間に 10 回まで
  throttle('diary_post/ip', limit: 10, period: 10.minutes) do |req|
    req.ip if req.path == '/diary/post' && req.post?
  end

  # 日記コメント: 同一 IP から 5 分間に 20 回まで
  throttle('diary_comment/ip', limit: 20, period: 5.minutes) do |req|
    req.ip if req.post? && req.path.match?(%r{\A/diary/show/[^/]+/comment\z})
  end

  # ギャラリー投稿: 同一 IP から 10 分間に 10 回まで
  throttle('gallery_upload/ip', limit: 10, period: 10.minutes) do |req|
    req.ip if req.path == '/gallery/view' && req.post?
  end

  # ギャラリーコメント: 同一 IP から 5 分間に 20 回まで
  throttle('gallery_comment/ip', limit: 20, period: 5.minutes) do |req|
    req.ip if req.post? && req.path.match?(%r{\A/gallery/selected/comment/[^/]+\z})
  end

  # メッセージ送信: 同一 IP から 5 分間に 30 回まで
  throttle('message_send/ip', limit: 30, period: 5.minutes) do |req|
    req.ip if req.post? && req.path.match?(%r{\A/message/send/[^/]+\z})
  end

  # --- 429 レスポンス ---
  # throttled_responder には Rack::Attack::Request(Rack::Requestのサブクラス)が渡される。
  # Accept ヘッダでの内容判定にActionDispatchのフォーマット判定を使うためenvから作り直す。
  self.throttled_responder = lambda do |request|
    req = ActionDispatch::Request.new(request.env)
    if req.format.html? || req.content_type&.include?('application/x-www-form-urlencoded')
      [
        429,
        { 'Content-Type' => 'text/html; charset=utf-8' },
        [<<~HTML],
          <!DOCTYPE html>
          <html lang="ja">
          <head><meta charset="UTF-8"><title>リクエスト制限</title>
          <style>body{font-family:sans-serif;text-align:center;padding:60px;}</style>
          </head>
          <body>
            <h1>リクエストが多すぎます</h1>
            <p>しばらく時間をおいてから再度お試しください。</p>
            <a href="/index">トップページへ</a>
          </body>
          </html>
        HTML
      ]
    else
      [429, { 'Content-Type' => 'application/json' }, ['{"error":"Too Many Requests"}']]
    end
  end
end
