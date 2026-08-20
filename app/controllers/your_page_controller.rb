class YourPageController < ApplicationController
  # クリエイターページ
  def creator_show
    @user = User.find(params[:id])
    @creator = User.joins(:creator).select('users.*, creators.*').find_by(creators: { user_id: params[:id] })
    return redirect_to '/index' unless @creator

    @art_category = ArtCategory.find_by(id: @creator.art_category_id)
    @fv_check = Favorite.exists?(user_id: Current.user_id, favorite_user_id: params[:id])
    @match = Match.exists?(user_id: Current.user_id, target_user_id: params[:id])
    @page_props = {
      user: {
        id: @user.id,
        name: @user.name,
        avatarPath: @user.avatar_path.to_s,
        isMan: @user.is_man,
        birthday: @user.birthday.to_s,
      },
      creator: {
        title: @creator.title,
        establishment: @creator.establishment,
        employee: @creator.employee,
        profile: @creator.profile,
        isRecruitment: @creator.is_recruitment,
      },
      artCategoryName: @art_category.name,
      isFavorited: @fv_check,
      loggedIn: Current.logged_in?,
      isOwnPage: Current.user_id == @user.id,
      isCreator: Current.creator?,
      isMatched: @match,
      targetUserId: @user.id,
      flash: flash.to_h,
    }
    render :your_page
  end

  # 後継者ページ
  def heir_show
    @user = User.find_by(id: params[:id])
    return redirect_to '/index' unless @user

    @art_name = ArtCategory.joins(:heirs).select('art_categories.name').find_by(heirs: { user_id: params[:id] })
    @scout = Match.exists?(user_id: Current.user_id, target_user_id: params[:id])
    @page_props = {
      user: {
        id: @user.id,
        name: @user.name,
        avatarPath: @user.avatar_path.to_s,
        isMan: @user.is_man,
        birthday: @user.birthday.to_s,
        profile: @user.profile,
      },
      artName: @art_name&.name,
      isScouted: @scout,
      loggedIn: Current.logged_in?,
      isCreator: Current.creator?,
      targetUserId: @user.id,
      flash: flash.to_h,
    }
    render :heir_page
  end
end
