class MyPageController < ApplicationController
  before_action :require_login

  def my_page
    @user = Current.user
    @page_props = {
      user: {
        name: @user.name,
        avatarPath: @user.avatar_path.to_s,
        isMan: @user.is_man,
        email: @user.email,
        birthday: @user.birthday.to_s,
        profile: @user.profile,
      },
      profileIncomplete: profile_incomplete?,
      isCreator: Current.creator?,
      flash: flash.to_h,
    }
  end

  def show
    @user = Current.user
    @page_props = {
      user: {
        name: @user.name,
        email: @user.email,
        profile: @user.profile,
        avatarPath: @user.avatar_path.to_s,
      },
      errors: [],
      isCreator: Current.creator?,
      flash: flash.to_h,
    }
    render :update
  end

  # アップデート実行
  def update
    @user = Current.user
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
          avatarPath: @user.avatar_path.to_s,
        },
        errors: @user.errors.full_messages,
        isCreator: Current.creator?,
        flash: flash.to_h,
      }
      render :update
    end
  end

  private

  # 職人なら creators、後継者なら heirs の詳細プロフィールが未登録かどうか
  def profile_incomplete?
    if Current.creator?
      Creator.find_by(user_id: Current.user_id).nil?
    else
      Heir.find_by(user_id: Current.user_id).nil?
    end
  end
end
