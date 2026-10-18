class YourPageController < ApplicationController
  # クリエイターページ
  def creator_show
    user = User.find(params.expect(:id))
    creator = user.creator
    return redirect_to '/index' unless creator

    @page_props = {
      user: {
        id: user.id,
        name: user.name,
        avatarPath: user.avatar_path.to_s,
        isMan: user.is_man,
        birthday: user.birthday.to_s,
      },
      creator: {
        title: creator.title,
        establishment: creator.establishment,
        employee: creator.employee,
        profile: user.profile,
        isRecruitment: creator.is_recruitment,
      },
      artCategoryName: creator.art_category.name,
      isFavorited: Favorite.exists?(user_id: Current.user_id, favorite_user_id: user.id),
      loggedIn: Current.logged_in?,
      isOwnPage: Current.user_id == user.id,
      isCreator: Current.creator?,
      isMatched: Match.exists?(user_id: Current.user_id, target_user_id: user.id),
      targetUserId: user.id,
      flash: flash.to_h,
    }
    render :your_page
  end

  # 後継者ページ
  def heir_show
    user = User.find_by(id: params[:id])
    return redirect_to '/index' unless user

    @page_props = {
      user: {
        id: user.id,
        name: user.name,
        avatarPath: user.avatar_path.to_s,
        isMan: user.is_man,
        birthday: user.birthday.to_s,
        profile: user.profile,
      },
      artName: user.heir&.art_category&.name,
      # matches は user_id = 後継者 / target_user_id = 職人 で格納される（スカウトも同じ向き）。
      # 閲覧者（職人）との間に既に行があれば、スカウトは一意制約で弾かれるので送信済み扱いにする
      isScouted: Match.exists?(user_id: user.id, target_user_id: Current.user_id),
      loggedIn: Current.logged_in?,
      isCreator: Current.creator?,
      targetUserId: user.id,
      flash: flash.to_h,
    }
    render :heir_page
  end
end
