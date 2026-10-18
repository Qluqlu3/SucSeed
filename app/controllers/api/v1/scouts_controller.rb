module Api
  module V1
    # スカウト（職人 → 後継者 への勧誘）。
    #
    #   GET   /api/v1/scouts      職人: 自分が送った一覧 / 後継者: 自分宛の未回答一覧
    #   POST  /api/v1/scouts      職人が後継者を勧誘する   body: { heir_id }
    #   PATCH /api/v1/scouts/:id  後継者が回答する（:id はスカウトしてきた職人の user_id）
    #                             body: { accepted: true|false }
    class ScoutsController < BaseController
      before_action :require_creator, only: :create
      before_action :require_non_creator, only: :update

      rate_limit_per_user to: 30, within: 10.minutes, only: :create

      PER_PAGE = 20

      # 職人: 自分が声を掛けた後継者 / 後継者: 自分に来た、まだ回答していないスカウト
      def index
        scope = Match.scouts.involving(Current.user).with_active_parties.order(created_at: :asc)
        scope = scope.pending unless Current.creator?
        pagy, scouts = paginate(scope, default_limit: PER_PAGE)

        render_collection(MatchSerializer.build(scouts), pagy: pagy)
      end

      def create
        scout = Match.scout(creator_id: Current.user_id, heir_id: params[:heir_id])
        return render_validation_failure(scout) unless scout.save

        render json: MatchSerializer.build([scout]).first, status: :created
      end

      def update
        scout = Match.answer_scout(heir_id: Current.user_id, creator_id: params[:id], accepted: accepted?)
        return render_not_found if scout.nil?

        render json: MatchSerializer.build([scout]).first
      end

      private

      def accepted?
        ActiveModel::Type::Boolean.new.cast(params.expect(:accepted))
      end
    end
  end
end
