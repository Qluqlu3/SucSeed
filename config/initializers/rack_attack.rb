class Rack::Attack
  # HTML(フォーム送信)と JSON API は同じ操作に対して別々のパスを持つ。
  # 片方だけ絞ってももう片方から素通しできてしまうので、必ず両方をマッチさせる。
  #
  # 例: ログインは /user/login (HTML) と /api/v1/session (JSON) の2経路がある。
  MATCHERS = {
    login: ->(path) { ['/user/login', '/api/v1/session'].include?(path) },
    admin_login: ->(path) { path == '/admin/login' },
    password_reset: ->(path) { path == '/user/password_forgot' },
    email_certified: ->(path) { path.start_with?('/email/certified/') },
    diary_post: ->(path) { ['/diary/post', '/api/v1/diaries'].include?(path) },
    diary_comment: lambda { |path|
      path.match?(%r{\A/diary/show/[^/]+/comment\z}) ||
        path.match?(%r{\A/api/v1/diaries/[^/]+/comments\z})
    },
    gallery_upload: ->(path) { path == '/gallery/view' },
    gallery_comment: lambda { |path|
      path.match?(%r{\A/gallery/selected/comment/[^/]+\z}) ||
        path.match?(%r{\A/api/v1/galleries/[^/]+/comments\z})
    },
    message_send: lambda { |path|
      path.match?(%r{\A/message/send/[^/]+\z}) ||
        path.match?(%r{\A/api/v1/message_threads/[^/]+/messages\z})
    },
    # マッチング操作（アピール/スカウトの送信）。HTML 版は未スロットルだった
    match_send: lambda { |path|
      path.match?(%r{\A/(match|scout)/send/[^/]+\z}) ||
        ['/api/v1/appeals', '/api/v1/scouts'].include?(path)
    },
  }.freeze

  def self.throttle_post(name, limit:, period:)
    throttle("#{name}/ip", limit: limit, period: period) do |req|
      req.ip if req.post? && MATCHERS.fetch(name).call(req.path)
    end
  end

  # --- ログイン ---
  # 同一 IP から 1 分間に 5 回まで
  throttle_post :login, limit: 5, period: 1.minute

  # 管理者ログイン: 同一 IP から 1 分間に 5 回まで
  throttle_post :admin_login, limit: 5, period: 1.minute

  # --- パスワードリセット ---
  # 同一 IP から 1 時間に 5 回まで
  throttle_post :password_reset, limit: 5, period: 1.hour

  # --- メール認証 ---
  # 同一 IP から 1 時間に 10 回まで
  throttle_post :email_certified, limit: 10, period: 1.hour

  # --- 投稿系（スパム対策） ---
  # 日記投稿: 同一 IP から 10 分間に 10 回まで
  throttle_post :diary_post, limit: 10, period: 10.minutes

  # 日記コメント: 同一 IP から 5 分間に 20 回まで
  throttle_post :diary_comment, limit: 20, period: 5.minutes

  # ギャラリー投稿: 同一 IP から 10 分間に 10 回まで
  throttle_post :gallery_upload, limit: 10, period: 10.minutes

  # ギャラリーコメント: 同一 IP から 5 分間に 20 回まで
  throttle_post :gallery_comment, limit: 20, period: 5.minutes

  # メッセージ送信: 同一 IP から 5 分間に 30 回まで
  throttle_post :message_send, limit: 30, period: 5.minutes

  # アピール/スカウト送信: 同一 IP から 10 分間に 30 回まで
  throttle_post :match_send, limit: 30, period: 10.minutes

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
      # API 側のエラー形式（Api::BaseController#render_error）と揃える
      [
        429,
        { 'Content-Type' => 'application/json' },
        ['{"error":{"code":"too_many_requests","message":"リクエストが多すぎます","details":[]}}'],
      ]
    end
  end
end
