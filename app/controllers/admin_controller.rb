class AdminController < ApplicationController
  def login
    @admin = Admin.new
    render :admin_login
  end

  def login_challenge
    if session[:admin] == nil
      admin = Admin.find_by(user_id: params[:admin][:user_id].downcase)
      if admin && admin.authenticate(params[:admin][:password])
        session[:admin] = admin[:id]
        redirect_to "/admin/index"
      else
        flash[:danger] = "ユーザーIDまたはパスワードが間違っています"
        render action: :admin_login
      end
    end
  end

  def create
    @admin = Admin.new
    @page_props = { errors: [] }
    render :admin_create
  end

  def create_user
    @admin = Admin.new(admin_create_params)
    if @admin.save
      flash[:success] = "success"
      redirect_to "/admin/login"
    else
      @page_props = { errors: @admin.errors.full_messages }
      render action: :admin_create
    end
  end
end

private
def admin_create_params
  params.require(:admin).permit(:name, :user_id, :password, :password_confirmation)
end
