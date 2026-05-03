class YourPageController < ApplicationController
  #クリエイターページ
  def creator_show
    @user = User.find(params[:id])
    @creator = User.joins(:creator).select("users.*, creators.*").find_by(creators: {user_id: params[:id]})
    @art_category = ArtCategory.find_by(id: @creator.art_category_id)
    # @creator_image = CreatorImage.where(user_id: params[:id]).first
    @favorite = Favorite.new
    @fv_check = Favorite.where(user_id: session[:id]).where(favorite_user_id: params[:id]).first
    @match = Match.where(user_id: session[:id]).where(target_user_id: params[:id]).first
    @page_props = {
      user: {
        id:         @user.id,
        name:       @user.name,
        avatarPath: @user.avatar_path.to_s,
        isMan:      @user.is_man,
        birthday:   @user.birthday.to_s
      },
      creator: {
        title:         @creator.title,
        establishment: @creator.establishment,
        employee:      @creator.employee,
        profile:       @creator.profile,
        isRecruitment: @creator.is_recruitment
      },
      artCategoryName: @art_category.name,
      isFavorited:     @fv_check.present?,
      loggedIn:        session[:id].present?,
      isOwnPage:       session[:id] == @user.id,
      isCreator:       session[:creator].present?,
      isMatched:       @match.present?,
      targetUserId:    @user.id,
      flash:           flash.to_h
    }
    render :your_page
  end

  #後継者ページ
  def heir_show
    @user = User.find_by("id = ?", params[:id])
    @art_name = ArtCategory.joins(:heirs).select("art_categories.name").find_by(heirs: {user_id: params[:id]})
    @scout = Match.where(user_id: session[:id]).where(target_user_id: params[:id])
    @page_props = {
      user: {
        id:         @user.id,
        name:       @user.name,
        avatarPath: @user.avatar_path.to_s,
        isMan:      @user.is_man,
        birthday:   @user.birthday.to_s,
        profile:    @user.profile
      },
      artName:      @art_name&.name,
      isScouted:    @scout.present?,
      loggedIn:     session[:id].present?,
      isCreator:    session[:creator].present?,
      targetUserId: params[:id].to_i,
      flash:        flash.to_h
    }
    render :heir_page
  end
end