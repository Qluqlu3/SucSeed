# 管理画面（AdminController / AdminEditController）用の認証 concern。
# 一般ユーザーの Authentication とはセッションキーも遷移先も異なるため別モジュールにしている。
module AdminAuthentication
  extend ActiveSupport::Concern

  # 最終操作からこの時間を過ぎた管理者セッションは無効とする。
  # 一般ユーザー（Authentication::SESSION_TIMEOUT = 2時間）より権限が強いので短くしている。
  ADMIN_SESSION_TIMEOUT = 30.minutes

  included do
    before_action :resume_admin_session
  end

  def start_new_admin_session_for(admin)
    session[:admin] = admin.id
    session[:admin_last_active_at] = Time.current
    Current.admin = admin
  end

  # 管理者のキーだけを消す。reset_session にしないのは、同じブラウザで
  # 一般ユーザーとしてもログインしている場合にそちらまで切らないため。
  def terminate_admin_session
    session.delete(:admin)
    session.delete(:admin_last_active_at)
    Current.admin = nil
  end

  private

  def resume_admin_session
    return if session[:admin].blank?

    if admin_session_expired?
      terminate_admin_session
      @admin_session_expired = true
      return
    end

    admin = Admin.find_by(id: session[:admin])
    return terminate_admin_session if admin.nil?

    session[:admin_last_active_at] = Time.current
    Current.admin = admin
  end

  # 最終操作時刻を持たないセッション（この仕組みを入れる前に張られたもの）も期限切れとして扱う。
  # そうしないと、既存の管理者セッションだけは期限無しで残り続ける。
  def admin_session_expired?
    last_active_at = session[:admin_last_active_at]
    last_active_at.blank? || Time.zone.parse(last_active_at.to_s) < ADMIN_SESSION_TIMEOUT.ago
  end

  def require_admin
    return if Current.admin?

    flash[:danger] = t('flash.danger.session_expired') if @admin_session_expired
    redirect_to '/admin/login'
  end
end
