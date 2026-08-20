class MessageController < ApplicationController
  before_action :require_login

  def view
    message_list = MessageQueryService.message_list(user_id: Current.user_id, is_creator: Current.creator?)
    @page_props = { messageLists: format_message_list(message_list), flash: flash.to_h }
    render :message_list
  end

  def message_list_add
    creator_id, heir_id = Current.creator? ? [Current.user_id, params[:id]] : [params[:id], Current.user_id]
    message_list = MessageList.new(creator_user_id: creator_id, heir_user_id: heir_id)

    if message_list.save
      # 双方向どちらの向きで成立したマッチかは分からないので両方を更新する
      Match.where(target_user_id: Current.user_id, user_id: params[:id]).update_all(is_add_list: true)
      Match.where(user_id: Current.user_id, target_user_id: params[:id]).update_all(is_add_list: true)
    else
      flash[:information] = t('flash.information.added')
    end
    redirect_to '/message/list'
  end

  def get_history
    message_list    = MessageQueryService.message_list(user_id: Current.user_id, is_creator: Current.creator?)
    message_history = MessageQueryService.message_history(user_id: Current.user_id, other_id: params[:id])
    to_user         = User.find(params[:id])
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
      fromUser: { id: from_user.id.to_s, avatarPath: from_user.avatar_path, name: from_user.name },
      toUser: { id: to_user.id.to_s, name: to_user.name, avatarPath: to_user.avatar_path },
    }
  end

  def format_message_list(message_list)
    message_list.map { |m| { id: m.id.to_s, name: m.name, avatarPath: m.avatar_path } }
  end

  def message_params
    params.require(:message).permit(:content)
  end
end
