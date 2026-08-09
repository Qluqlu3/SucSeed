class IndexController < ApplicationController
  CREATOR_COLUMNS = 'users.*, creators.title, creators.user_id, creators.prefecture_code'.freeze
  CREATORS_PER_PAGE = 12

  def index
    creator_scope = if session[:creator].present?
                      User.joins(:creator).select(CREATOR_COLUMNS).where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true })
                    else
                      User.joins(:creator).select(CREATOR_COLUMNS).where(creators: { is_recruitment: true })
                    end
    # 地図の都道府県別件数は一覧の現在ページに依らず全体を反映させたいので、
    # ページングする前のスコープから別途集計する。
    # count引数を省略すると.select(CREATOR_COLUMNS)の複数カラム文字列がそのまま
    # COUNT(...)に渡ってSQLエラーになるため、明示的にCOUNT(*)を指定する
    creator_count_by_prefecture = creator_scope.group('creators.prefecture_code').count(:all)
    pagy, creators = pagy(creator_scope, limit: CREATORS_PER_PAGE)

    @recommend = if session[:id].present? && session[:creator].nil?
                   interest = Heir.select('heirs.art_category_id').find_by(user_id: session[:id])
                   User.joins(:creator).select(CREATOR_COLUMNS).where(creators: { art_category_id: interest, is_recruitment: true }).random_sample(4)
                 end

    @page_props = {
      creators: CreatorCardPresenter.build(creators),
      creatorCountByPrefecture: creator_count_by_prefecture,
      pagination: pagination_props(pagy),
      recommend: @recommend&.then { |r| CreatorCardPresenter.build(r) },
      traditionalCrafts: TraditionalCraftPresenter.build(TraditionalCraft.includes(:art_category)),
      loggedIn: session[:id].present?,
      isCreator: session[:creator].present?,
      flash: flash.to_h,
    }
  end

  def root
    redirect_to '/index'
  end

  def search_user
    art_category_id = params.dig(:search, :art_category_id)
    return redirect_to '/index' if art_category_id.blank?

    creator_scope = if session[:creator].present?
                      User.joins(:creator).select(CREATOR_COLUMNS).where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true, art_category_id: art_category_id })
                    else
                      User.joins(:creator).select(CREATOR_COLUMNS).where(creators: { is_recruitment: true, art_category_id: art_category_id })
                    end
    pagy, creators = pagy(creator_scope, limit: CREATORS_PER_PAGE)

    @page_props = {
      creators: CreatorCardPresenter.build(creators),
      pagination: pagination_props(pagy),
      artCategoryId: art_category_id.to_i,
      flash: flash.to_h,
    }
    render :search_user
  end
end
