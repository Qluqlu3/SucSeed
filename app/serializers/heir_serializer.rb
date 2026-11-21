# 後継者のページの表現。入力は User（後継者 = 職人でないユーザー）。
#
# 詳細プロフィール（heirs）が未登録の後継者もいるので、heirs 由来の項目は null になりうる。
class HeirSerializer < ApplicationSerializer
  attribute(:user_id, &:id)
  attribute(:art_category_id)   { |user| user.heir&.art_category_id }
  attribute(:art_category_name) { |user| user.heir&.art_category&.name }
  attribute(:introduction)      { |user| user.heir&.introduction }
  attribute(:user)              { |user| PublicUserSerializer.new(user).serializable_hash }

  # 閲覧者（職人）との間に既にアピール/スカウトがあるか。新しくスカウトできないので「スカウト済み」と出す
  attribute(:is_scouted) { |user| params[:scouted_user_ids]&.include?(user.id) || false }
  attribute(:is_own)     { |user| user.id == params[:viewer_id] }
end
