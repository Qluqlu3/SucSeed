class AddCompositeIndexToMessages < ActiveRecord::Migration[7.2]
  def change
    add_index :messages, %i[send_user_id receive_user_id created_at],
              name: 'index_messages_on_send_receive_created'
  end
end
