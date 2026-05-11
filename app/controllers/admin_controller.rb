class AdminController < ApplicationController
  before_action :require_basic_auth, only: [:create, :create_user]

  def login
    @admin = Admin.new
    @page_props = { flash: flash.to_h }
    render :admin_login
  end

  def login_challenge
    if session[:admin].nil?
      admin = Admin.find_by(user_id: params[:admin][:user_id].downcase)
      if admin && admin.authenticate(params[:admin][:password])
        session[:admin] = admin[:id]
        redirect_to "/admin/index"
      else
        flash[:danger] = "ユーザーIDまたはパスワードが間違っています"
        @page_props = { flash: flash.to_h }
        render :admin_login
      end
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
      flash[:success] = "success"
      redirect_to "/admin/login"
    else
      @page_props = { errors: @admin.errors.full_messages, flash: flash.to_h }
      render :admin_create
    end
  end

  private

  def require_basic_auth
    authenticate_or_request_with_http_basic('Admin Setup') do |_user, password|
      password == ENV.fetch('ADMIN_CREATE_PASSWORD', nil)
    end
  end

  def admin_create_params
    params.require(:admin).permit(:name, :user_id, :password, :password_confirmation)
  end
end
