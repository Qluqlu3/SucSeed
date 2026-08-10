class Gallery < ApplicationRecord
  include SoftDeletable
  include RandomSampleable

  mount_uploader :data, GalleryUploader
  has_secure_token :id
  belongs_to :user
  has_many :gallery_goods
  has_many :gallery_comments
  validates :comment, presence: true, length: { minimum: 1 }
  validates :data, presence: true
  acts_as_taggable
end
