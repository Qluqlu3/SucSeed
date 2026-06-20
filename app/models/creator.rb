class Creator < ApplicationRecord
  include SoftDeletable

  validates :user_id, presence: true
  validates :title, presence: true, length: {maximum: 50}
  validates :art_category_id, presence: true
  validates :establishment, presence: true, numericality: {only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 500}
  validates :employee, presence: true, numericality: {only_integer: true, greater_than_or_equal_to: 0}
  validates :postal_code, presence: true, numericality: true, length: { is: 7 }
  belongs_to :art_category
  belongs_to :user
end
