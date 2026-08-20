class MapController < ApplicationController
  # 都道府県地図から職人を探すページ
  def index
    creators = RecruitingCreatorsQuery.call(
      exclude_user_id: Current.creator? ? Current.user_id : nil,
    )

    @page_props = {
      creators: CreatorCardSerializer.build(creators),
      traditionalCrafts: TraditionalCraftSerializer.build(TraditionalCraft.includes(:art_category)),
      flash: flash.to_h,
    }
  end
end
