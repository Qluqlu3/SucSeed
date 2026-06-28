class UserController < ApplicationController
  def login
    return unless session[:id].nil?

    user = User.find_by(email: params[:session][:email].downcase)
    if user&.authenticate(params[:session][:password])
      reset_session
      session[:id] = user[:id]
      session[:creator] = user[:id] if user[:is_creator]
      session[:last_active_at] = Time.current
      user.update_column(:login_time, Time.current)
      flash[:success] = 'ログイン成功'
    else
      flash[:danger] = '『メールアドレス』もしくは『パスワード』が誤っています'
    end
    redirect_to '/index'
  end

  def logout
    reset_session
    flash[:success] = 'ログアウト'
    redirect_to '/index'
  end

  def regist
    @user = User.new
    @page_props = { errors: [], flash: flash.to_h }
  end

  def create
    expires_in 1.hour
    @user = User.new(user_params)
    if @user.save
      GmailMailer.send_certification(@user).deliver_now
      flash[:success] = '登録完了。認証メールを送信しました。'
      redirect_to '/index'
    else
      @page_props = { errors: @user.errors.full_messages, flash: flash.to_h }
      render :regist
    end
  end

  def password_forgot
    @page_props = { flash: flash.to_h }
    render :password_forgot
  end

  def email_exist
    if params[:user_email][:email] == ''
      flash.now[:danger] = 'メールアドレスを入力してください'
      @page_props = { flash: flash.to_h }
      render :password_forgot
      return
    end

    user = User.find_by(email: params[:user_email][:email])
    if user
      user.generate_password_reset_token!
      GmailMailer.send_password_reset(user).deliver_now
    end
    flash[:success] = 'パスワードリセット用のメールを送信しました（登録済みの場合）'
    redirect_to '/index'
  rescue StandardError
    @page_props = { flash: flash.to_h }
    render :password_forgot
  end

  def password_edit
    user = User.find_by(password_reset_token: params[:token])
    if user.nil? || user.password_reset_token_expired?
      flash[:danger] = 'リンクが無効か期限切れです。再度お試しください。'
      redirect_to '/user/password_forgot'
      return
    end

    @page_props = { token: params[:token], errors: [], flash: flash.to_h }
    render :password_reset
  end

  def password_reset
    user = User.find_by(password_reset_token: params[:token])
    if user.nil? || user.password_reset_token_expired?
      flash[:danger] = 'リンクが無効か期限切れです。再度お試しください。'
      redirect_to '/user/password_forgot'
      return
    end

    if user.update(password: params[:user][:password], password_confirmation: params[:user][:password_confirmation])
      user.update_columns(password_reset_token: nil, password_reset_sent_at: nil)
      flash[:success] = 'パスワードを変更しました。'
      redirect_to '/index'
    else
      flash.now[:danger] = 'エラー'
      @page_props = { token: params[:token], errors: user.errors.full_messages, flash: flash.to_h }
      render :password_reset
    end
  end

  def email_certified_show
    user = User.find_by(email_verification_token: params[:token])
    if user && !user.email_verification_token_expired?
      @page_props = { userName: user.name, token: params[:token], flash: flash.to_h }
      render :email_certified
    elsif user&.email_verification_token_expired?
      flash[:danger] = '認証リンクの有効期限（24時間）が切れています。再度登録をお試しください。'
      redirect_to '/index'
    else
      flash[:danger] = '認証リンクが無効です。再度登録をお試しください。'
      redirect_to '/index'
    end
  end

  def email_certified
    user = User.find_by(email_verification_token: params[:token])
    if user.nil? || user.is_certified?
      flash[:danger] = '認証リンクが無効か、すでに認証済みです。'
    elsif user.email_verification_token_expired?
      flash[:danger] = '認証リンクの有効期限（24時間）が切れています。再度登録をお試しください。'
    elsif user.update(is_certified: true, email_verification_token: nil, email_verification_sent_at: nil)
      flash[:success] = 'メールアドレスの認証が完了しました。'
    else
      flash[:danger] = 'メールアドレス認証エラー'
    end
    redirect_to '/index'
  end

  private

  def user_params
    params.require(:user).permit(:name, :avatar_path, :email, :birthday, :password, :password_confirmation, :is_man, :is_creator)
  end
end
