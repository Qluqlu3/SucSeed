class AddEmailVerificationSentAtToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :email_verification_sent_at, :datetime
  end
end
