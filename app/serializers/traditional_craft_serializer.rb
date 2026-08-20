# 地図ページで紹介する伝統工芸品（マスタデータ）の表現。
class TraditionalCraftSerializer < ApplicationSerializer
  attributes :id, :name, :prefecture_code, :summary, :designated_year, :production_area,
             :image_path, :source_url

  attribute(:category_name) { |craft| craft.art_category&.name }
  attribute :features, &:feature_list

  # 「同じ分野 × 同じ都道府県の職人が何人いるか」を工芸品ごとに出す。
  # 1件ずつ count すると工芸品の数だけクエリが飛ぶので、まとめて集計してから引く。
  attribute(:related_creators_count) do |craft|
    params[:creator_counts][[craft.art_category_id, craft.prefecture_code]]
  end

  def self.build(crafts)
    crafts = crafts.to_a
    creator_counts = Creator.where(art_category_id: crafts.filter_map(&:art_category_id))
                            .group(:art_category_id, :prefecture_code)
                            .count
                            .tap { |h| h.default = 0 }

    new(crafts, params: { creator_counts: creator_counts }).serializable_hash
  end
end
