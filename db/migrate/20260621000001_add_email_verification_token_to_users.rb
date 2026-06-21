class AddEmailVerificationTokenToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :email_verification_token, :string
    add_index :users, :email_verification_token, unique: true
  end
end
