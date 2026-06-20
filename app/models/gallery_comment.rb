class GalleryComment < ApplicationRecord
  include SoftDeletable

  belongs_to :gallery
  belongs_to :user
  validates :comment, presence: true
end
