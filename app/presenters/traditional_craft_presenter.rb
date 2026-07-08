class TraditionalCraftPresenter
  def self.build(crafts)
    crafts.map do |c|
      {
        id: c.id,
        name: c.name,
        prefectureCode: c.prefecture_code,
        categoryName: c.art_category&.name,
        summary: c.summary,
        features: c.feature_list,
      }
    end
  end
end
