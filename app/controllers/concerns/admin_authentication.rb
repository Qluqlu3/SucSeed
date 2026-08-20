# 管理画面（AdminController / AdminEditController）用の認証 concern。
# 一般ユーザーの Authentication とはセッションキーも遷移先も異なるため別モジュールにしている。
module AdminAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :resume_admin_session
  end

  def start_new_admin_session_for(admin)
    session[:admin] = admin.id
    Current.admin = admin
  end

  private

  def resume_admin_session
    return if session[:admin].blank?

    Current.admin = Admin.find_by(id: session[:admin])
  end

  def require_admin
    return if Current.admin?

    redirect_to '/admin/login'
  end
end
