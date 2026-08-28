class User < ApplicationRecord
  include SoftDeletable
  include RandomSampleable

  mount_uploader :avatar_path, AvatarUploader

  # Rails 8.1 の has_secure_password はパスワードリセット用の署名付きトークンを内蔵しており、
  #   user.password_reset_token          -> 有効期限付きの署名済みトークンを生成
  #   User.find_by_password_reset_token  -> 期限切れ/改竄なら nil
  # を提供する。トークンには password_salt が埋め込まれているため、
  # パスワードが変わった時点で発行済みトークンが自動的に無効になる。
  # 既定の有効期限は15分だが、従来の挙動に合わせて1時間にしている。
  has_secure_password reset_token: { expires_in: 1.hour }
  has_secure_token :id

  # メールアドレス認証トークン。値に email を含めるため、
  # 認証メール送信後にメールアドレスを変更すると古いトークンは無効になる。
  generates_token_for :email_verification, expires_in: 24.hours do
    email
  end

  # 大文字小文字やスペースの違いで別アカウント扱いにならないよう、
  # 保存前と検索時(find_by)の両方でメールアドレスを正規化する。
  normalizes :email, with: ->(email) { email.to_s.strip.downcase }

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

  def email_verification_token
    generate_token_for(:email_verification)
  end

  def self.find_by_email_verification_token(token)
    find_by_token_for(:email_verification, token)
  end
end
