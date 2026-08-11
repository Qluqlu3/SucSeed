class DiaryComment < ApplicationRecord
  include SoftDeletable

  validates :comment, presence: true, length: { maximum: 100 }
  belongs_to :diary
  belongs_to :user
end
