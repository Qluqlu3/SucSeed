class Match < ApplicationRecord
  belongs_to :user, class_name: 'User'
  belongs_to :target_user, class_name: 'User'
  validates :user_id, uniqueness: { scope: :target_user_id }
end
