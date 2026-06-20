class Favorite < ApplicationRecord
  # 組み合わせユニーク
  validates :user_id, uniqueness: { scope: :favorite_user_id }
  belongs_to :user, class_name: 'User'
  belongs_to :favorite_user, class_name: 'User'
end
