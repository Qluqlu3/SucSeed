class MyPageController < ApplicationController
  before_action :require_login

  def my_page
    @created = if session[:creator].present?
                 Creator.find_by(user_id: session[:id]) ? 0 : 1
               else
                 Heir.find_by(user_id: session[:id]) ? 0 : 1
               end
    @user = User.find(session[:id])
    @page_props = {
      user: {
        name: @user.name,
        avatarPath: @user.avatar_path.to_s,
        isMan: @user.is_man,
        email: @user.email,
        birthday: @user.birthday.to_s,
        profile: @user.profile
      },
      profileIncomplete: @created == 1,
      isCreator: session[:creator].present?,
      flash: flash.to_h
    }
  end

  def show
    @user = User.find(session[:id])
    @page_props = {
      user: {
        name: @user.name,
        email: @user.email,
        profile: @user.profile,
        avatarPath: @user.avatar_path.to_s
      },
      errors: [],
      isCreator: session[:creator].present?,
      flash: flash.to_h
    }
    render :update
  end

  # アップデート実行
  def update
    @user = User.find(session[:id])
    if @user.update(avatar_path: params[:user][:avatar_path], name: params[:user][:name], email: params[:user][:email],
                    profile: params[:user][:profile])
      flash[:success] = t('flash.success.saved')
      redirect_to '/my_page/my_page'
    else
      flash[:danger] = t('flash.danger.error')
      @page_props = {
        user: {
          name: @user.name,
          email: @user.email,
          profile: @user.profile,
          avatarPath: @user.avatar_path.to_s
        },
        errors: @user.errors.full_messages,
        isCreator: session[:creator].present?,
        flash: flash.to_h
      }
      render :update
    end
  end
end
