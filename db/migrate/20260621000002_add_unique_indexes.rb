class AddUniqueIndexes < ActiveRecord::Migration[7.2]
  def change
    add_index :users, :email, unique: true, name: 'index_users_on_email_unique'
    add_index :diary_goods, %i[user_id diary_id], unique: true
    add_index :gallery_goods, %i[user_id gallery_id], unique: true
    add_index :favorites, %i[user_id favorite_user_id], unique: true
    add_index :matches, %i[user_id target_user_id], unique: true
    add_index :message_lists, %i[creator_user_id heir_user_id], unique: true
  end
end
