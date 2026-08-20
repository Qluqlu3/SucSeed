# 職人一覧カード（frontend/components/CreatorCard）の表現。
# トップページ・検索結果・地図ページ・API の職人一覧で共用する。
#
# 入力は「users を主体に creators を join した行」。users.* を select しているため
# id / name / avatar_path / created_at は users 側、title / prefecture_code は
# creators 側の値になる。
class CreatorCardSerializer < ApplicationSerializer
  attributes :user_id, :name, :title, :prefecture_code, :created_at

  attribute(:avatar_path)          { |row| image_url(row.avatar_path) }
  attribute(:gallery_count)        { |row| galleries_of(row).size }
  attribute(:gallery_preview_path) { |row| galleries_of(row).first&.data&.to_s }

  # ギャラリー枚数とサムネイルは1件ずつ引くと N+1 になるため、
  # 一覧分をまとめて読み込んでから user_id でグルーピングして渡す。
  def self.build(creator_rows)
    rows = creator_rows.to_a
    galleries_by_user = Gallery.where(user_id: rows.map(&:user_id))
                               .order(created_at: :desc)
                               .group_by(&:user_id)

    new(rows, params: { galleries_by_user: galleries_by_user }).serializable_hash
  end

  private

  def galleries_of(row)
    params[:galleries_by_user][row.user_id] || []
  end
end
