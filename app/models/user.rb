class User < ApplicationRecord
  include SoftDeletable
  include RandomSampleable

  mount_uploader :avatar_path, AvatarUploader
  has_secure_password
  has_secure_token :id
  validates :name, presence: true, length: { minimum: 1 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }
  validates :email, uniqueness: true, on: :create
  validates :password, allow_nil: true, presence: true, confirmation: true, length: { in: 8..16 },
                       format: { with: /\A[a-zA-Z0-9]+\z/ }
  has_one :creator
  has_one :heir
  has_many :diaries
  has_many :diary_comments
  has_many :diary_goods
  has_many :galleries
  has_many :gallery_goods
  has_many :gallery_comments
  has_many :inquiries
  has_many :favorites, class_name: 'Favorite'
  has_many :favorited_by, class_name: 'Favorite', foreign_key: :favorite_user_id
  has_many :sent_messages, class_name: 'Message', foreign_key: :send_user_id
  has_many :received_messages, class_name: 'Message', foreign_key: :receive_user_id
  has_many :sent_matches, class_name: 'Match'
  has_many :target_matches, class_name: 'Match', foreign_key: :target_user_id
  has_many :creator_message_lists, class_name: 'MessageList', foreign_key: :creator_user_id
  has_many :heir_message_lists, class_name: 'MessageList', foreign_key: :heir_user_id
  acts_as_tagger

  before_create :generate_email_verification_token

  def generate_password_reset_token!
    update_columns(
      password_reset_token: SecureRandom.urlsafe_base64(32),
      password_reset_sent_at: Time.current,
    )
  end

  def password_reset_token_expired?
    password_reset_sent_at < 1.hour.ago
  end

  def email_verification_token_expired?
    email_verification_sent_at < 24.hours.ago
  end

  private

  def generate_email_verification_token
    self.email_verification_token = SecureRandom.urlsafe_base64(32)
    self.email_verification_sent_at = Time.current
  end
end
