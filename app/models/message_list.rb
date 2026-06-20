class MessageList < ApplicationRecord
  validates :creator_user_id, uniqueness: { scope: :heir_user_id }
  belongs_to :creator_user, class_name: 'User'
  belongs_to :heir_user, class_name: 'User'
end
