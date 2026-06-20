class DiaryComment < ApplicationRecord
  include SoftDeletable

  validates :comment, presence: true
  belongs_to :diary
  belongs_to :user
end
