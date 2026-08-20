# ギャラリー個別ページ（/gallery/selected/:id と API の GET /galleries/:id）で
# 必要になるデータ一式をまとめて構築する。
#
# HTML 側とAPI側で同じ内容を別々に組み立てると必ず片方だけズレていくため、
# ここを唯一の取得元にする。JSON 化は GalleryDetailSerializer が受け持つ。
class GalleryDetailQueryService
  # 同じタグが付いた他の職人の作品を何件出すか
  RELATED_TAG_LIMIT = 3
  # 同じ職人の他の作品を何件出すか
  OTHER_GALLERY_LIMIT = 2

  def self.build(gallery, viewer_id:)
    {
      gallery: gallery,
      creator: Creator.includes(:user).find_by(user_id: gallery.user_id),
      owner: User.find_by(id: gallery.user_id),
      good_count: GalleryGood.where(gallery_id: gallery.id).count,
      my_good: viewer_id.present? && GalleryGood.exists?(gallery_id: gallery.id,
                                                         user_id: viewer_id),
      comments: GalleryComment.where(gallery_id: gallery.id)
                              .includes(:user).order(created_at: :desc),
      match_tag_galleries: related_by_tag(gallery),
      other_galleries: Gallery.where(user_id: gallery.user_id)
                              .where.not(id: gallery.id)
                              .random_sample(OTHER_GALLERY_LIMIT),
    }
  end

  def self.related_by_tag(gallery)
    Gallery.tagged_with([gallery.tag_list], any: true)
           .where.not(user_id: gallery.user_id)
           .random_sample(RELATED_TAG_LIMIT)
  end
  private_class_method :related_by_tag
end
