# ログイン中ユーザー自身を表す最小限の表現。
# コメント入力欄のアバター表示など「自分」を描画する箇所で使う。
class CurrentUserSerializer < ApplicationSerializer
  attributes :id, :name

  attribute(:avatar_path) { |user| image_url(user.avatar_path) }
end
