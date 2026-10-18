class MessageController < ApplicationController
  before_action :require_login

  def view
    message_list = MessageQueryService.message_list(user_id: Current.user_id, is_creator: Current.creator?)
    @page_props = { messageLists: format_message_list(message_list), flash: flash.to_h }
    render :message_list
  end

  def message_list_add
    unless MessageList.open_between(Current.user, params[:id])
      flash[:information] = t('flash.information.added')
    end
    redirect_to '/message/list'
  end

  def get_history
    message_list    = MessageQueryService.message_list(user_id: Current.user_id, is_creator: Current.creator?)
    # 画面は古い順に上から並べ、最下部（最新）へスクロールした状態で開く
    message_history = MessageQueryService.message_history(user_id: Current.user_id, other_id: params[:id],
                                                          direction: :asc)
    to_user         = User.find(params.expect(:id))
    @page_props = build_message_page_props(message_list, message_history, Current.user, to_user).merge(flash: flash.to_h)
    render :message
  end

  def send_message
    message = Message.new(message_params.merge(send_user_id: Current.user_id, receive_user_id: params[:id]))
    flash[:danger] = t('flash.danger.error') unless message.save
    redirect_to "/message/history/#{params[:id]}"
  end

  private

  def build_message_page_props(message_list, message_history, from_user, to_user)
    {
      messageLists: format_message_list(message_list),
      messageHistory: message_history.map { |m| { sendUserId: m.send_user_id.to_s, content: m.content, createdAt: m.created_at } },
      fromUser: { id: from_user.id.to_s, avatarPath: from_user.avatar_path.to_s, name: from_user.name },
      toUser: { id: to_user.id.to_s, name: to_user.name, avatarPath: to_user.avatar_path.to_s },
    }
  end

  def format_message_list(message_list)
    message_list.map { |m| { id: m.id.to_s, name: m.name, avatarPath: m.avatar_path.to_s } }
  end

  def message_params
    params.expect(message: [:content])
  end
end
