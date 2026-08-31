# ギャラリーフィード(一覧)表示に必要なクエリ一式をまとめて構築する。
# favorite_gallery/my_gallery/heir_favorite_gallery と API のギャラリー一覧で共用する。
#
# DiaryFeedQueryService と同じく、絞り込みスコープ(scope_for)と集計(build)を
# 分けてあり、API 側はページネーションしてから集計できる。
#
# 戻り値は「素のデータ」のみ。JSON 化は GallerySerializer.from_feed が受け持つ。
class GalleryFeedQueryService
  def self.scope_for(target_ids)
    Gallery.where(user_id: target_ids)
           .includes(:taggings, :tags)
           .order(created_at: :desc)
  end

  # タグで絞り込んだスコープ（特定ユーザーの作品をタグで絞る用途）
  def self.tagged_scope_for(target_ids, tag)
    Gallery.tagged_with([tag], any: true)
           .includes(:taggings, :tags)
           .where(user_id: target_ids)
           .order(created_at: :desc)
  end

  def self.build(galleries:, viewer_id:)
    gallery_ids = galleries.map(&:id)

    {
      galleries: galleries,
      good_count: GalleryGood.where(gallery_id: gallery_ids).group(:gallery_id).count,
      my_good_ids: my_good_ids(gallery_ids, viewer_id),
    }
  end

  def self.my_good_ids(gallery_ids, viewer_id)
    return Set.new if viewer_id.blank?

    GalleryGood.where(gallery_id: gallery_ids, user_id: viewer_id)
               .distinct
               .pluck(:gallery_id)
               .to_set
  end
  private_class_method :my_good_ids
end
