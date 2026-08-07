# ギャラリーフィード(一覧)表示に必要なクエリ一式をまとめて構築する。
# favorite_gallery/my_gallery/heir_favorite_galleryで共通の複雑な
# クエリチェーンがコピペされていたのをここに集約する。
class GalleryFeedQueryService
  def self.build(target_ids:, viewer_id:)
    galleries = Gallery.where(user_id: target_ids)
                       .includes(:taggings, :tags)
                       .order(created_at: :desc)
    gallery_ids = galleries.map(&:id)

    good_count = GalleryGood.where(gallery_id: gallery_ids).group(:gallery_id).count

    my_good_ids = Gallery.joins(:gallery_goods)
                         .where(galleries: { user_id: target_ids })
                         .where(gallery_goods: { user_id: viewer_id })
                         .distinct
                         .pluck(:id)
                         .to_set

    {
      galleries: GalleryFeedPresenter.build(galleries: galleries, good_count: good_count,
                                            my_good_ids: my_good_ids),
    }
  end
end
