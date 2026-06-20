class DiaryGood < ApplicationRecord
  # 組み合わせユニーク
  validates :user_id, uniqueness: { scope: :diary_id }
  belongs_to :diary
  belongs_to :user
end
