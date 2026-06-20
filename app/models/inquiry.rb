class Inquiry < ApplicationRecord
  include SoftDeletable

  belongs_to :inquiry_category, optional: true
  belongs_to :user, optional: true
  belongs_to :admin, optional: true
  validates :content, presence: true
  validates :inquiry_category_id, presence: {message: "を選択してください"}
end
