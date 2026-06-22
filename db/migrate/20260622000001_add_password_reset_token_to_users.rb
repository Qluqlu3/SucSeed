class AddPasswordResetTokenToUsers < ActiveRecord::Migration[7.2]
  def change
    change_table :users, bulk: true do |t|
      t.string :password_reset_token
      t.datetime :password_reset_sent_at
    end
    add_index :users, :password_reset_token, unique: true
  end
end
