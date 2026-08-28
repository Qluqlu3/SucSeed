class UserController < ApplicationController
  def login
    return if Current.logged_in?

    # authenticate_by は「メールアドレスが存在しない場合でもダミーのハッシュ計算を行う」
    # ため、応答時間からアカウントの存在有無を推測されるのを防げる。
    # メールアドレスの正規化(downcase)は User の normalizes が担当する。
    user = User.authenticate_by(email: params[:session][:email], password: params[:session][:password])

    if user
      start_new_session_for(user)
      user.update_column(:login_time, Time.current)
      flash[:success] = t('flash.success.login')
    else
      flash[:danger] = t('flash.danger.login_failed')
    end
    redirect_to '/index'
  end

  def logout
    terminate_session
    flash[:success] = t('flash.success.logout')
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
      flash[:success] = t('flash.success.register')
      redirect_to '/index'
    else
      @page_props = { errors: @user.errors.full_messages, flash: flash.to_h }
      render :regist, status: :unprocessable_content
    end
  end

  def password_forgot
    @page_props = { flash: flash.to_h }
    render :password_forgot
  end

  def email_exist
    if params[:user_email][:email] == ''
      flash.now[:danger] = t('flash.danger.email_blank')
      @page_props = { flash: flash.to_h }
      render :password_forgot
      return
    end

    # トークンは has_secure_password が署名付きで都度生成するため、
    # DB への保存は不要（メール本文の URL に含めるだけ）。
    user = User.find_by(email: params[:user_email][:email])
    GmailMailer.send_password_reset(user).deliver_now if user

    flash[:success] = t('flash.success.password_reset_sent')
    redirect_to '/index'
  rescue StandardError
    @page_props = { flash: flash.to_h }
    render :password_forgot
  end

  def password_edit
    # 期限切れ・改竄・存在しないユーザーはいずれも nil が返る
    user = User.find_by_password_reset_token(params[:token])
    if user.nil?
      flash[:danger] = t('flash.danger.invalid_link')
      redirect_to '/user/password_forgot'
      return
    end

    @page_props = { token: params[:token], errors: [], flash: flash.to_h }
    render :password_reset
  end

  def password_reset
    user = User.find_by_password_reset_token(params[:token])
    if user.nil?
      flash[:danger] = t('flash.danger.invalid_link')
      redirect_to '/user/password_forgot'
      return
    end

    # パスワードが変わるとトークンに埋め込まれた password_salt も変わるため、
    # 発行済みのリセットリンクは自動的に無効になる（明示的な後始末は不要）。
    if user.update(password: params[:user][:password], password_confirmation: params[:user][:password_confirmation])
      flash[:success] = t('flash.success.password_changed')
      redirect_to '/index'
    else
      flash.now[:danger] = t('flash.danger.error')
      @page_props = { token: params[:token], errors: user.errors.full_messages, flash: flash.to_h }
      render :password_reset
    end
  end

  def email_certified_show
    user = User.find_by_email_verification_token(params[:token])
    if user.nil?
      flash[:danger] = t('flash.danger.email_token_invalid')
      redirect_to '/index'
      return
    end

    @page_props = { userName: user.name, token: params[:token], flash: flash.to_h }
    render :email_certified
  end

  def email_certified
    user = User.find_by_email_verification_token(params[:token])
    if user.nil?
      flash[:danger] = t('flash.danger.email_token_invalid')
    elsif user.is_certified?
      flash[:danger] = t('flash.danger.email_already_certified')
    elsif user.update(is_certified: true)
      flash[:success] = t('flash.success.email_certified')
    else
      flash[:danger] = t('flash.danger.email_certified_error')
    end
    redirect_to '/index'
  end

  private

  def user_params
    params.expect(user: %i[name avatar_path email birthday password password_confirmation
                           is_man is_creator])
  end
end
