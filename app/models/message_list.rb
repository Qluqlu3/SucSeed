class MessageList < ApplicationRecord
  validates :creator_user_id, :uniqueness => {:scope => :heir_user_id}
  belongs_to :creator_user, class_name: 'User', :foreign_key => 'creator_user_id'
  belongs_to :heir_user, class_name: 'User', :foreign_key => 'heir_user_id'
end
