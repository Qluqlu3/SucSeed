class AdminController < ApplicationController
  before_action :require_basic_auth, only: %i[create create_user]

  def login
    @admin = Admin.new
    @page_props = { flash: flash.to_h }
    render :admin_login
  end

  def login_challenge
    return unless session[:admin].nil?

    admin = Admin.find_by(user_id: params[:admin][:user_id].downcase)
    if admin&.authenticate(params[:admin][:password])
      session[:admin] = admin[:id]
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
    params.require(:admin).permit(:name, :user_id, :password, :password_confirmation)
  end
end
