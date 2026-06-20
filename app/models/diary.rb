class Diary < ApplicationRecord
  include SoftDeletable

  has_secure_token :id
  belongs_to :user
  has_many :diary_goods, dependent: :destroy
  has_many :diary_comments, dependent: :destroy
  validates :content, presence: true, length: {minimum: 1}
  validates :user_id, presence: true
end
