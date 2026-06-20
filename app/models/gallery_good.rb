class GalleryGood < ApplicationRecord
  validates :user_id, uniqueness: { scope: :gallery_id }
  belongs_to :gallery
  belongs_to :user
end
