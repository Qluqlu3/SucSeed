# セッションからの認証・認可を一手に引き受ける concern。
#
# HTML を返す ApplicationController と JSON を返す Api::BaseController の双方が
# include する。両者で異なるのは「拒否したときに何を返すか」だけなので、
# その3つ（#on_session_expired / #on_authentication_required / #on_authorization_failed）
# をフックとして切り出し、既定は API 向け（ステータスコードのみ）にしてある。
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
end
