class TraditionalCraftPresenter
  def self.build(crafts)
    crafts = crafts.to_a
    creator_counts = Creator.where(art_category_id: crafts.filter_map(&:art_category_id))
                            .group(:art_category_id, :prefecture_code)
                            .count
                            .tap { |h| h.default = 0 }

    crafts.map do |c|
      {
        id: c.id,
        name: c.name,
        prefectureCode: c.prefecture_code,
        categoryName: c.art_category&.name,
        summary: c.summary,
        features: c.feature_list,
        designatedYear: c.designated_year,
        productionArea: c.production_area,
        imagePath: c.image_path,
        sourceUrl: c.source_url,
        relatedCreatorsCount: creator_counts[[c.art_category_id, c.prefecture_code]],
      }
    end
  end
end
