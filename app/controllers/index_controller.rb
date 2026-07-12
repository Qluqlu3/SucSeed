class IndexController < ApplicationController
  CREATOR_COLUMNS = 'users.*, creators.title, creators.user_id, creators.prefecture_code'.freeze

  def index
    @creator = if session[:creator].present?
                 User.joins(:creator).select(CREATOR_COLUMNS).where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true })
               else
                 User.joins(:creator).select(CREATOR_COLUMNS).where(creators: { is_recruitment: true })
               end

    @recommend = if session[:id].present? && session[:creator].nil?
                   interest = Heir.select('heirs.art_category_id').find_by(user_id: session[:id])
                   User.joins(:creator).select(CREATOR_COLUMNS).where(creators: { art_category_id: interest, is_recruitment: true }).order('RAND()').limit(4)
                 end

    @page_props = {
      creators: CreatorCardPresenter.build(@creator),
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
    return redirect_to '/index' if params[:search][:art_category_id] == ''

    @creator = if session[:creator].present?
                 User.joins(:creator).select(CREATOR_COLUMNS).where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true, art_category_id: params[:search][:art_category_id] })
               else
                 User.joins(:creator).select(CREATOR_COLUMNS).where(creators: { is_recruitment: true, art_category_id: params[:search][:art_category_id] })
               end

    @page_props = { creators: CreatorCardPresenter.build(@creator), flash: flash.to_h }
    render :search_user
  end
end
