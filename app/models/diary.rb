class Diary < ApplicationRecord
  include SoftDeletable

  has_secure_token :id
  belongs_to :user
  has_many :diary_goods
  has_many :diary_comments
  validates :content, presence: true, length: { minimum: 1 }
end
