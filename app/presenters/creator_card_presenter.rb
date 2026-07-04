# 職人一覧カード(CreatorCard)用の共通フォーマッタ。
# IndexController(トップページ・検索結果)とMapController(地図ページ)で共用する。
class CreatorCardPresenter
  def self.build(creators)
    creators = creators.to_a
    galleries_by_user = Gallery.where(user_id: creators.map(&:user_id))
                               .order(created_at: :desc)
                               .group_by(&:user_id)

    creators.map do |c|
      galleries = galleries_by_user[c.user_id] || []
      {
        userId: c.user_id,
        name: c.name,
        title: c.title,
        avatarPath: c.avatar_path.to_s,
        createdAt: c.created_at,
        prefectureCode: c.prefecture_code,
        galleryCount: galleries.size,
        galleryPreviewPath: galleries.first&.data&.to_s
      }
    end
  end
end
