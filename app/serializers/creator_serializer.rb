# 職人プロフィールの詳細表現（相手ページ / 自分のプロフィール確認画面）。
#
# CreatorCardSerializer が「users を主体に join した行」を扱うのに対し、
# こちらは Creator モデルそのものを受け取る。boolean が正しくキャストされる、
# 関連を辿れるといった利点があるため、新規の API はこちらを使う。
#
# 閲覧者ごとに変わるフラグ（お気に入り済みか等）は params で受け取る。
class CreatorSerializer < ApplicationSerializer
  attributes :user_id, :title, :establishment, :employee, :postal_code, :prefecture_code,
             :is_recruitment, :art_category_id

  attribute(:art_category_name) { |creator| creator.art_category&.name }
  attribute(:user)              do |creator|
    PublicUserSerializer.new(creator.user).serializable_hash
  end

  # 閲覧者から見た関係性。未ログインや一覧用途では params を渡さないので false になる。
  attribute(:is_favorited) do |creator|
    params[:favorited_user_ids]&.include?(creator.user_id) || false
  end
  attribute(:is_appealed) do |creator|
    params[:appealed_user_ids]&.include?(creator.user_id) || false
  end
  attribute(:is_own) { |creator| creator.user_id == params[:viewer_id] }
end
