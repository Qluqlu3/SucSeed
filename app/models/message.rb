class Message < ApplicationRecord
  belongs_to :send_user, class_name: 'User'
  belongs_to :receive_user, class_name: 'User'
  validates :content, presence: true, length: { minimum: 1 }
end
