class UserController < ApplicationController
  def login
    if session[:id] == nil
      user = User.find_by(email: params[:session][:email].downcase)
      if user && user.authenticate(params[:session][:password])
        session[:id] = user[:id]
        if user[:is_creator]
          session[:creator] = user[:id]
        end
        flash[:success] = "ログイン成功"
        redirect_to "/index"
      else
        flash[:danger] = '『メールアドレス』もしくは『パスワード』が誤っています'
        redirect_to "/index"
      end
    end
  end

  def logout
    session[:id] = nil
    session[:creator] = nil
    flash[:success] = "ログアウト"
    redirect_to "/index"
  end

  def regist
    @user = User.new
    @page_props = { errors: [] }
  end

  def create
    expires_in 1.hour
    @user = User.new(user_params)
    if @user.save
      # GmailMailer.send_create(@user).deliver
      # GmailMailer.send_certification(@user).deliver
      flash[:success] = "登録完了"
      redirect_to "/index"
    else
      @page_props = { errors: @user.errors.full_messages }
      render :regist
    end
  end

  def password_forgot
    render :password_forgot
  end

  def email_exist
    begin
      if params[:user_email][:email] != ""
        if user = User.find_by(email: params[:user_email][:email])
          session[:reset_id] = user[:id]
          redirect_to "/user/password_reset"
        else
          flash.now[:danger] = "入力されたメールアドレスは存在しません"
          render :password_forgot
        end
      else
        flash.now[:danger] = "メールアドレスを入力してください"
        render :password_forgot
      end
    rescue => e
      render :password_forgot
    end
  end

  def password_edit
    @user = User.new
    @page_props = { errors: [] }
    render :password_reset
  end

  def password_reset
    @user = User.find(session[:reset_id])
    if @user.update_attributes(:password => params[:user][:password], :password_confirmation => params[:user][:password_confirmation])
      flash[:success] = "success"
      session[:reset_id] = nil
      render :login
    else
      flash.now[:danger] = "エラー"
      @page_props = { errors: @user.errors.full_messages }
      render :password_edit
    end
  end

  def email_certified_show
    if session[:id] != nil
      @user = User.find_by("id = ?", params[:id])
      @page_props = { userName: @user.name, userId: session[:id] }
      render :email_certified
    else
      redirect_to "/index"
    end
  end

  #メールアドレス認証
  def email_certified
    if User.find_by("id = ?", params[:id]).select("users.is_certified")
      redirect_to "/index"
    else
      user = User.find_by("id = ?", params[:id])
      if user.update_all(:is_certified => 1)
        flash[:success] = "メールアドレス認証完了"
      else
        flash[:danger] = "メールアドレス認証エラー"
      end
    end
  end

end

private
def user_params
  params.require(:user).permit(:id, :name, :avatar_path, :email, :birthday, :password, :password_confirmation, :is_man, :is_creator)
end