module Api
  module V1
    # メッセージスレッド（＝やり取りする相手）の一覧と履歴。
    #   GET  /api/v1/message_threads      やり取り相手の一覧
    #   GET  /api/v1/message_threads/:id  :id の相手との履歴（古い順）
    #   POST /api/v1/message_threads      相手をリストに追加  body: { user_id }
    class MessageThreadsController < BaseController
      THREADS_PER_PAGE = 20
      MESSAGES_PER_PAGE = 50

      def index
        scope = MessageQueryService.message_list(user_id: Current.user_id, is_creator: Current.creator?)
        pagy, partners = paginate(scope, default_limit: THREADS_PER_PAGE)

        render_collection(CurrentUserSerializer.new(partners).serializable_hash, pagy: pagy)
      end

      # 履歴は「新しい順にページを切り出し、ページ内は古い順に並べ替えて」返す。
      # チャットは直近のやり取りから見たいが、表示は時系列順が自然なため。
      # page=2 で1つ前のページ（より古い50件）が取れる。
      def show
        partner = User.find(params.expect(:id))
        scope = MessageQueryService.message_history(user_id: Current.user_id, other_id: partner.id,
                                                    direction: :desc)
        pagy, newest_first = paginate(scope, default_limit: MESSAGES_PER_PAGE)
        messages = newest_first.to_a.reverse

        render json: {
          partner: CurrentUserSerializer.new(partner).serializable_hash,
          messages: MessageSerializer.new(messages, params: { viewer_id: Current.user_id }).serializable_hash,
          pagination: pagination_payload(pagy),
        }
      end

      def create
        partner_id = params.expect(:user_id)

        # 既にスレッドがある場合は検証で弾かれる。冪等に「ある」ことを返す。
        unless MessageList.open_between(Current.user, partner_id)
          return render json: { userId: partner_id, alreadyExists: true }
        end

        render json: { userId: partner_id, alreadyExists: false }, status: :created
      end
    end
  end
end
