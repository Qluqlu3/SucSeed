class MyPageController < ApplicationController
  before_action :require_login

  # プロフィールの表現は API の GET /api/v1/profile と同じ ProfileSerializer を使う
  def my_page
    @page_props = {
      user: ProfileSerializer.render(Current.user),
      isCreator: Current.creator?,
      flash: flash.to_h,
    }
  end

  def show
    render_edit_form(Current.user)
  end

  # アップデート実行
  def update
    user = Current.user
    if user.update(params.expect(user: %i[avatar_path name email profile]))
      flash[:success] = t('flash.success.saved')
      redirect_to '/my_page/my_page'
    else
      flash[:danger] = t('flash.danger.error')
      render_edit_form(user, errors: user.errors.full_messages)
    end
  end

  private

  def render_edit_form(user, errors: [])
    @page_props = {
      user: ProfileSerializer.render(user),
      errors: errors,
      isCreator: Current.creator?,
      flash: flash.to_h,
    }
    render :update
  end
end
