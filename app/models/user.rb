class User < ApplicationRecord
  mount_uploader :avatar_path, AvatarUploader
  has_secure_password
  has_secure_token :id
  validates :name, presence: true, length: {minimum: 1}
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }
  validates :email, uniqueness: true, on: :create
  validates :password, allow_nil: true, presence: true, confirmation: true, length: { in: 8..16 }, format: {with: /[a-zA-Z0-9]/}
  has_one :creator, dependent: :destroy
  has_one :heir, dependent: :destroy
  has_many :diaries, dependent: :destroy
  has_many :diary_comments, dependent: :destroy
  has_many :diary_goods, dependent: :destroy
  has_many :galleries, dependent: :destroy
  has_many :gallery_goods, dependent: :destroy
  has_many :gallery_comments, dependent: :destroy
  has_many :inquiries, dependent: :destroy
  has_many :favorites, class_name: 'Favorite', foreign_key: :user_id, dependent: :destroy
  has_many :favorited_by, class_name: 'Favorite', foreign_key: :favorite_user_id, dependent: :destroy
  has_many :sent_messages, class_name: 'Message', foreign_key: :send_user_id, dependent: :destroy
  has_many :received_messages, class_name: 'Message', foreign_key: :receive_user_id, dependent: :destroy
  has_many :sent_matches, class_name: 'Match', foreign_key: :user_id, dependent: :destroy
  has_many :target_matches, class_name: 'Match', foreign_key: :target_user_id, dependent: :destroy
  has_many :creator_message_lists, class_name: 'MessageList', foreign_key: :creator_user_id, dependent: :destroy
  has_many :heir_message_lists, class_name: 'MessageList', foreign_key: :heir_user_id, dependent: :destroy
  acts_as_tagger
end
