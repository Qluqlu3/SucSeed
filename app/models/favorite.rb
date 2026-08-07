class Favorite < ApplicationRecord
  # 組み合わせユニーク
  validates :user_id, uniqueness: { scope: :favorite_user_id }
  belongs_to :user, class_name: 'User'
  belongs_to :favorite_user, class_name: 'User'

  # 自分自身 + お気に入り登録した相手のuser_id一覧（フィード系クエリの絞り込みで使う）
  def self.self_and_favorite_ids(user_id)
    [user_id] + where(user_id: user_id).pluck(:favorite_user_id)
  end
end
