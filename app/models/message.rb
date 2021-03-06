class Message < ApplicationRecord
  belongs_to :send_user, class_name: 'User', :foreign_key => 'send_user_id'
  belongs_to :receive_user, class_name: 'User', :foreign_key => 'receive_user_id'
  validates :content, presence: true, length: {minimum: 1}
end
