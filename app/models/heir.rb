class Heir < ApplicationRecord
  belongs_to :art_category
  belongs_to :user
  validates :art_category_id, presence: { message: 'を選択してください' }
end
