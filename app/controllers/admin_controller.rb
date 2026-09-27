class AdminController < ApplicationController
  include AdminAuthentication

  before_action :require_basic_auth, only: %i[create create_user]

  def login
    @admin = Admin.new
    @page_props = { flash: flash.to_h }
    render :admin_login
  end

  def login_challenge
    return if Current.admin?

    # find_by + authenticate だと user_id が存在しないときだけ bcrypt が走らず即座に返るため、
    # 応答時間から管理者 ID の存在を推測できてしまう。authenticate_by はどちらでも同じ計算をする。
    credentials = params.expect(admin: %i[user_id password])
    admin = Admin.authenticate_by(user_id: credentials[:user_id].to_s.downcase, password: credentials[:password])
    if admin
      start_new_admin_session_for(admin)
      redirect_to '/admin/index'
    else
      flash[:danger] = t('flash.danger.admin_login_failed')
      @page_props = { flash: flash.to_h }
      render :admin_login
    end
  end

  def create
    @admin = Admin.new
    @page_props = { errors: [], flash: flash.to_h }
    render :admin_create
  end

  def create_user
    @admin = Admin.new(admin_create_params)
    if @admin.save
      flash[:success] = t('flash.success.saved')
      redirect_to '/admin/login'
    else
      @page_props = { errors: @admin.errors.full_messages, flash: flash.to_h }
      render :admin_create
    end
  end

  private

  def require_basic_auth
    authenticate_or_request_with_http_basic('Admin Setup') do |_user, password|
      expected_password = ENV.fetch('ADMIN_CREATE_PASSWORD', nil)
      expected_password.present? && ActiveSupport::SecurityUtils.secure_compare(password.to_s, expected_password)
    end
  end

  def admin_create_params
    params.expect(admin: %i[name user_id password password_confirmation])
  end
end
