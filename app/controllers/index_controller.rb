class IndexController < ApplicationController
  CREATORS_PER_PAGE = 12

  def index
    creator_scope = recruiting_creators
    # 地図の都道府県別件数は一覧の現在ページに依らず全体を反映させたいので、
    # ページングする前のスコープから別途集計する。
    # count引数を省略すると複数カラムのselect文字列がそのままCOUNT(...)に
    # 渡ってSQLエラーになるため、明示的にCOUNT(*)を指定する
    creator_count_by_prefecture = creator_scope.group('creators.prefecture_code').count(:all)
    pagy, creators = pagy(creator_scope, limit: CREATORS_PER_PAGE)

    @page_props = {
      creators: CreatorCardSerializer.build(creators),
      creatorCountByPrefecture: creator_count_by_prefecture,
      pagination: pagination_props(pagy),
      recommend: recommended_creators,
      traditionalCrafts: TraditionalCraftSerializer.build(TraditionalCraft.includes(:art_category)),
      loggedIn: Current.logged_in?,
      isCreator: Current.creator?,
      flash: flash.to_h,
    }
  end

  def root
    redirect_to '/index'
  end

  def search_user
    art_category_id = params.dig(:search, :art_category_id)
    return redirect_to '/index' if art_category_id.blank?

    pagy, creators = pagy(recruiting_creators(art_category_id: art_category_id), limit: CREATORS_PER_PAGE)

    @page_props = {
      creators: CreatorCardSerializer.build(creators),
      pagination: pagination_props(pagy),
      artCategoryId: art_category_id.to_i,
      flash: flash.to_h,
    }
    render :search_user
  end

  private

  def recruiting_creators(art_category_id: nil)
    RecruitingCreatorsQuery.call(
      art_category_id: art_category_id,
      # 職人としてログイン中なら自分自身を一覧から外す（自分に応募する導線を出さないため）
      exclude_user_id: Current.creator? ? Current.user_id : nil,
    )
  end

  # 後継者側ログイン時のみ「興味のある分野」からおすすめを出す。
  # 旧実装は Heir インスタンスをそのまま where に渡していて絞り込みが効いていなかったため、
  # art_category_id を取り出して渡すよう修正した。
  def recommended_creators
    return nil if !Current.logged_in? || Current.creator?

    interest = Heir.find_by(user_id: Current.user_id)&.art_category_id
    return nil if interest.blank?

    CreatorCardSerializer.build(recruiting_creators(art_category_id: interest).random_sample(4))
  end
end
