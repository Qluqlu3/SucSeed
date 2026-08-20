# ギャラリーフィード(一覧)表示に必要なクエリ一式をまとめて構築する。
# favorite_gallery/my_gallery/heir_favorite_galleryで共通の複雑な
# クエリチェーンがコピペされていたのをここに集約する。
#
# 戻り値は「素のデータ」のみ。JSON 化は GallerySerializer.from_feed が受け持つ。
class GalleryFeedQueryService
  def self.build(target_ids:, viewer_id:)
    galleries = Gallery.where(user_id: target_ids)
                       .includes(:taggings, :tags)
                       .order(created_at: :desc)
    gallery_ids = galleries.map(&:id)

    good_count = GalleryGood.where(gallery_id: gallery_ids).group(:gallery_id).count

    my_good_ids = GalleryGood.where(gallery_id: gallery_ids, user_id: viewer_id)
                             .distinct
                             .pluck(:gallery_id)
                             .to_set

    {
      galleries: galleries,
      good_count: good_count,
      my_good_ids: my_good_ids,
    }
  end
end
