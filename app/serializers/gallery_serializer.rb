# ギャラリー1件（フィード/一覧での表現）。
#
# goodCount / myGood は閲覧者ごとに変わるため params 経由で受け取る。
# params を渡さない場合は 0 / false になる（タグ検索結果など集計を伴わない一覧）。
class GallerySerializer < ApplicationSerializer
  attributes :id

  attribute(:data_url)   { |gallery| image_url(gallery.data) }
  attribute(:tags)       { |gallery| gallery.tag_list.to_a }
  attribute(:good_count) { |gallery| params[:good_count]&.[](gallery.id) || 0 }
  attribute(:my_good)    { |gallery| params[:my_good_ids]&.include?(gallery.id) || false }

  # GalleryFeedQueryService が組み立てた集計結果からフィードを描画する。
  def self.from_feed(feed)
    new(feed[:galleries],
        params: { good_count: feed[:good_count],
                  my_good_ids: feed[:my_good_ids] }).serializable_hash
  end
end
