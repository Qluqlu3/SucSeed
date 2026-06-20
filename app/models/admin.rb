class Admin < ApplicationRecord
  include SoftDeletable

  has_secure_password
  has_many :inquiries
  validates :password, presence: true, confirmation: true, length: {in: 8..16}
  validates :name, presence: true, uniqueness: true, length: {minimum: 1}
  validates :user_id, presence: true, uniqueness: true, length: {minimum: 1}
end
