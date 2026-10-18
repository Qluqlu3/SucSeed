module Api
  module V1
    # アピール（後継者 → 職人 への応募）。
    #
    #   GET   /api/v1/appeals      職人: 自分宛の未回答一覧 / 後継者: 自分が送った一覧
    #   POST  /api/v1/appeals      後継者が職人に応募する    body: { creator_id }
    #   PATCH /api/v1/appeals/:id  職人が回答する（:id は応募してきた後継者の user_id）
    #                              body: { accepted: true|false }
    class AppealsController < BaseController
      before_action :require_non_creator, only: :create
      before_action :require_creator, only: :update

      rate_limit_per_user to: 30, within: 10.minutes, only: :create

      PER_PAGE = 20

      # 職人: 自分に応募してきた、まだ回答していない後継者 / 後継者: 自分が応募した職人
      def index
        scope = Match.appeals.involving(Current.user).with_active_parties.order(created_at: :asc)
        scope = scope.pending if Current.creator?
        pagy, appeals = paginate(scope, default_limit: PER_PAGE)

        render_collection(MatchSerializer.build(appeals), pagy: pagy)
      end

      def create
        appeal = Match.appeal(heir_id: Current.user_id, creator_id: params[:creator_id])
        return render_validation_failure(appeal) unless appeal.save

        render json: MatchSerializer.build([appeal]).first, status: :created
      end

      def update
        appeal = Match.answer_appeal(creator_id: Current.user_id, heir_id: params[:id], accepted: accepted?)
        return render_not_found if appeal.nil?

        render json: MatchSerializer.build([appeal]).first
      end

      private

      def accepted?
        ActiveModel::Type::Boolean.new.cast(params.expect(:accepted))
      end
    end
  end
end
