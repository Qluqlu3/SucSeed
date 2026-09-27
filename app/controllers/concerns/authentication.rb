# セッションからの認証・認可を一手に引き受ける concern。
#
# HTML を返す ApplicationController と JSON を返す Api::BaseController の双方が
# include する。両者で異なるのは「拒否したときに何を返すか」だけなので、
# その4つ（#on_session_expired / #on_authentication_required / #on_authorization_failed /
# #on_login_rate_limited）をフックとして切り出し、既定は API 向け（ステータスコードのみ）にしてある。
# HTML 側は ApplicationController が redirect + flash で上書きする。
module Authentication
  extend ActiveSupport::Concern

  # 最終アクティブ時刻からこの時間を過ぎたセッションは無効とする
  SESSION_TIMEOUT = 2.hours

  included do
    before_action :resume_session
  end

  class_methods do
    # before_action :require_login を後から外すための糖衣。
    #   allow_unauthenticated_access only: %i[index show]
    def allow_unauthenticated_access(**options)
      skip_before_action :require_login, **options
    end

    # メールアドレス単位のログイン試行制限。
    # Rack::Attack は IP 単位なので、多数の IP から1つのアカウントを狙う
    # 総当たりは通ってしまう。狙われている側を基準に数えて塞ぐ。
    # HTML のフォームと API のどちらか片方にしか掛けないと、もう片方が抜け道になる。
    # scope を固定しているのは、既定（controller_path）のままだとコントローラごとに
    # 別カウントになり、両方を使えば上限の2倍まで試せてしまうため。
    #   limit_login_attempts_per_email only: :create
    def limit_login_attempts_per_email(**options)
      rate_limit to: 10, within: 10.minutes, scope: 'login', name: 'by-email',
                 by: -> { login_rate_limit_key }, with: -> { on_login_rate_limited }, **options
    end
  end

  # ── セッション操作 ────────────────────────────────────────────────

  # ログイン成立時にセッションを張り直す。
  # reset_session を挟むのはセッション固定化攻撃（Session Fixation）対策。
  def start_new_session_for(user)
    reset_session
    session[:id] = user.id
    session[:last_active_at] = Time.current
    Current.user = user
  end

  def terminate_session
    reset_session
    Current.user = nil
  end

  private

  # 全リクエストの入口。セッションを検証して Current.user を確定させる。
  def resume_session
    return if session[:id].blank?

    if session_expired?
      terminate_session
      return on_session_expired
    end

    user = User.find_by(id: session[:id])
    # 論理削除済み・実在しない ID のセッションはここで破棄する。
    # 放置すると後続の User.find が RecordNotFound を投げて 404 になり、
    # 「ログインしているのに全ページ 404」という不可解な状態になるため。
    return terminate_session if user.nil?

    session[:last_active_at] = Time.current
    Current.user = user
  end

  def session_expired?
    session[:last_active_at].present? && session[:last_active_at] < SESSION_TIMEOUT.ago
  end

  # レート制限は params の検証より前に走るため、session が Hash 以外
  # （?session=foo のような形）で送られてくる可能性がある。
  # その場合はメールアドレスを取り出せないので IP で数える。
  def login_rate_limit_key
    session_params = params[:session]
    email = session_params.is_a?(ActionController::Parameters) ? session_params[:email] : nil
    email.to_s.strip.downcase.presence || request.remote_ip
  end

  # ── before_action として使う認可フィルタ ──────────────────────────

  def require_login
    return if Current.logged_in?

    on_authentication_required
  end

  # 職人（creator）専用アクション
  def require_creator
    return if Current.creator?

    on_authorization_failed
  end

  # 後継者側（＝ログイン済みかつ creator ではない）専用アクション
  def require_non_creator
    return if Current.logged_in? && !Current.creator?

    on_authorization_failed
  end

  # ── 拒否時の応答（HTML 側は ApplicationController が上書きする）────

  def on_session_expired
    head :unauthorized
  end

  def on_authentication_required
    head :unauthorized
  end

  def on_authorization_failed
    head :forbidden
  end

  def on_login_rate_limited
    head :too_many_requests
  end
end
