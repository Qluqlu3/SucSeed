class MapController < ApplicationController
  CREATOR_COLUMNS = 'users.*, creators.title, creators.user_id, creators.prefecture_code'.freeze

  # 都道府県地図から職人を探すページ
  def index
    @creator = if session[:creator].present?
                 User.joins(:creator).select(CREATOR_COLUMNS).where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true })
               else
                 User.joins(:creator).select(CREATOR_COLUMNS).where(creators: { is_recruitment: true })
               end

    @page_props = {
      creators: CreatorCardPresenter.build(@creator),
      flash: flash.to_h
    }
  end
end
