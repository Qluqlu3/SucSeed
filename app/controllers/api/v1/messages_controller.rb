module Api
  module V1
    # メッセージ送信。
    #   POST /api/v1/message_threads/:message_thread_id/messages
    #        body: { message: { content: "..." } }
    class MessagesController < BaseController
      def create
        receiver = User.find(params[:message_thread_id])
        message = Message.new(message_params.merge(send_user_id: Current.user_id,
                                                   receive_user_id: receiver.id))
        return render_validation_failure(message) unless message.save

        render json: MessageSerializer.new(message, params: { viewer_id: Current.user_id }).serializable_hash,
               status: :created
      end

      private

      def message_params
        params.require(:message).permit(:content)
      end
    end
  end
end
