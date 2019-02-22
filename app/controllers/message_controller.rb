class MessageController < ApplicationController
  #表示
  def view
    if session[:id] != nil && session[:creator] != nil
      @message_list = User.joins(:message_lists).select("users.name, users.avatar_path, users.id AS user, message_lists.*").where(message_lists: {creator_user_id: session[:id]}).order("message_lists.updated_at DESC")
      # @message_list_1 = User.joins(:message_lists).select("users.*, message_lists.*").where(message_lists: {creator_user_id: session[:id]}).order("message_lists.updated_at DESC").limit(1)
      # @message = User.joins(:messages).select("users.*, messages.*").where(messages: {send_user_id: session[:id]}).where(messages: {receive_user_id: @message_list_1}).order("messages.created_at ASC")
      render :message_list
    elsif  session[:id] != nil && session[:creator] == nil
      @message_list = User.joins("inner join message_lists on users.id = message_lists.creator_user_id").select("users.name, users.avatar_path, users.id AS user, message_lists.*").where(message_lists: {heir_user_id: session[:id]}).order("message_lists.updated_at DESC")
      render :message_list
    else
      redirect_to "/index"
    end
  end

  #新規追加
  def message_list_add
    if session[:creator] != nil
      message_list = MessageList.new(creator_user_id: session[:id], heir_user_id: params[:id]);
       if message_list.save
         redirect_to "/message/list"
       else
        flash.now[:information] = "追加済み"
       end
    elsif session[:id] != nil && session[:creator] == nil
      message_list = MessageList.new(heir_user_id: params[:id], creator_user_id: session[:id])
      if message_list.save
        redirect_to "/message/list"
      else
        flash.now[:information] = "追加済み"
      end
    else
      redirect_to "/index"
    end
    Match.where(target_user_id: session[:id]).where(user_id: params[:id]).update_all(:is_add_list => true)
    Match.where(user_id: session[:id]).where(target_user_id: params[:id]).update_all(:is_add_list => true)
  end

  #履歴取得
  def get_history
    if session[:id] != nil && session[:creator] == nil
      @message = Message.new
      @message_list = User.joins("inner join message_lists on users.id = message_lists.creator_user_id").select("users.name, users.avatar_path, users.id AS user, message_lists.*").where(message_lists: {heir_user_id: session[:id]}).order("message_lists.updated_at DESC")
      @message_history = Message.where(send_user_id: session[:id]).where(receive_user_id: params[:id]).or(Message.where(send_user_id: params[:id]).where(receive_user_id: session[:id])).order("messages.created_at DESC")
      @from_user = User.find(session[:id])
      @to_user = User.find(params[:id])
      render :message
    elsif session[:id] != nil && session[:creator] != nil
      @message = Message.new
      @message_list = User.joins(:message_lists).select("users.name, users.avatar_path, users.id AS user, message_lists.*").where(message_lists: {creator_user_id: session[:id]}).order("message_lists.updated_at DESC")
      @message_history = Message.where(send_user_id: session[:id]).where(receive_user_id: params[:id]).or(Message.where(send_user_id: params[:id]).where(receive_user_id: session[:id])).order("messages.created_at DESC")
      @from_user = User.find(session[:id])
      @to_user = User.find(params[:id])
      render :message
    else
      redirect_to "/index"
    end
  end


  #送信
  def send_message
    if session[:id] != nil
      params[:message][:send_user_id] = session[:id]
      params[:message][:receive_user_id] = params[:id]
      @message = Message.new(message_params)
      if @message.save
        @message = Message.new
        # @message_list = User.joins(:message_lists).select("users.*, users.id AS user, message_lists.*").where(message_lists: {creator_user_id: session[:id]}).order("message_lists.updated_at DESC")
        @message_history = Message.where(send_user_id: session[:id]).where(receive_user_id: params[:id]).or(Message.where(send_user_id: params[:id]).where(receive_user_id: session[:id])).order("messages.created_at ASC")
        @from_user = User.find(session[:id])
        @to_user = User.find(params[:id])
      else
        flash[:danger] = "エラー"
      end
      if session[:id] != nil && session[:creator] != nil
        @message_history = Message.where(send_user_id: session[:id]).where(receive_user_id: params[:id]).or(Message.where(send_user_id: params[:id]).where(receive_user_id: session[:id])).order("messages.created_at ASC")
        @message_list = User.joins(:message_lists).select("users.*, users.id AS user, message_lists.*").where(message_lists: {creator_user_id: session[:id]}).order("message_lists.updated_at DESC")
      elsif session[:id] != nil && session[:creator] == nil
        @message_list = User.joins("inner join message_lists on users.id = message_lists.creator_user_id").select("users.*, users.id AS user, message_lists.*").where(message_lists: {heir_user_id: session[:id]}).order("message_lists.updated_at DESC")
        @message_history = Message.where(send_user_id: session[:id]).where(receive_user_id: params[:id]).or(Message.where(send_user_id: params[:id]).where(receive_user_id: session[:id])).order("messages.created_at ASC")
      end
      redirect_to "/message/history/#{@to_user.id}"
    else
      redirect_to "/index"
    end

  end
end

private
def message_params
  params.require(:message).permit(:send_user_id, :receive_user_id, :content)
end

private
def message_list_params
  params.require(:message_list).permit(:creator_user_id, :heir_user_id)
end