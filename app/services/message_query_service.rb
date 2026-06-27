class MessageQueryService
  def self.message_list(user_id:, is_creator:)
    if is_creator
      User.joins(:heir_message_lists)
          .select('users.name, users.avatar_path, users.id')
          .where(message_lists: { creator_user_id: user_id })
          .order('message_lists.updated_at DESC')
    else
      User.joins('INNER JOIN message_lists ON users.id = message_lists.creator_user_id')
          .select('users.name, users.avatar_path, users.id')
          .where(message_lists: { heir_user_id: user_id })
          .order('message_lists.updated_at DESC')
    end
  end

  def self.message_history(user_id:, other_id:, direction: :desc)
    order = direction == :asc ? 'ASC' : 'DESC'
    Message.where(send_user_id: user_id, receive_user_id: other_id)
           .or(Message.where(send_user_id: other_id, receive_user_id: user_id))
           .order("messages.created_at #{order}")
  end
end
