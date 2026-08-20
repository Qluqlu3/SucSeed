# ギャラリー個別ページの表現。
# 入力は GalleryDetailQueryService.build が返すハッシュ（＝1件分の詳細データ）。
#
# 他のシリアライザと違い ActiveRecord ではなく「詳細データのまとまり」を扱うため、
# 各属性はハッシュから値を取り出す形になっている。
class GalleryDetailSerializer < ApplicationSerializer
  attribute(:gallery_id) { |detail| detail[:gallery].id }
  attribute(:data_url)   { |detail| image_url(detail[:gallery].data) }
  attribute(:tags)       { |detail| detail[:gallery].tag_list.to_a }
  attribute(:comment)    { |detail| detail[:gallery].comment }
  attribute(:created_at) { |detail| display_time(detail[:gallery].created_at) }

  attribute(:good_count) { |detail| detail[:good_count] }
  attribute(:my_good)    { |detail| detail[:my_good] }
  attribute(:comments)   { |detail| CommentSerializer.new(detail[:comments]).serializable_hash }

  attribute(:match_tag_galleries) { |detail| thumbnails(detail[:match_tag_galleries]) }
  attribute(:other_galleries)     { |detail| thumbnails(detail[:other_galleries]) }

  # 投稿者が職人プロフィール未登録の場合もあるため nil を許容する
  attribute(:creator) do |detail|
    creator = detail[:creator]
    next nil if creator.nil?

    {
      'userId' => creator.user_id,
      'name' => creator.user.name,
      'avatarPath' => image_url(creator.user.avatar_path),
      'title' => creator.title,
      'establishment' => creator.establishment,
      'employee' => creator.employee,
    }
  end

  private

  def thumbnails(galleries)
    galleries.map { |gallery| { 'id' => gallery.id, 'dataUrl' => image_url(gallery.data) } }
  end
end
