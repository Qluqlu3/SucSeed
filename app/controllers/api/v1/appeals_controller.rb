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

      def index
        render_collection(MatchSerializer.build(Current.creator? ? received_appeals : sent_appeals))
      end

      def create
        appeal = Match.new(user_id: Current.user_id, target_user_id: params[:creator_id], is_scout: false)
        return render_validation_failure(appeal) unless appeal.save

        render json: MatchSerializer.build([appeal]).first, status: :created
      end

      def update
        appeal = Match.find_by(user_id: params[:id], target_user_id: Current.user_id, is_scout: false)
        return render_not_found if appeal.nil?

        appeal.update!(is_ok: accepted?)
        render json: MatchSerializer.build([appeal]).first
      end

      private

      # 職人から見た「自分に応募してきた、まだ回答していない後継者」
      def received_appeals
        Match.includes(:user, :target_user)
             .where(target_user_id: Current.user_id, is_scout: false, is_ok: nil)
             .order(created_at: :asc)
      end

      # 後継者から見た「自分が応募した職人」
      def sent_appeals
        Match.includes(:user, :target_user)
             .where(user_id: Current.user_id, is_scout: false)
             .order(created_at: :asc)
      end

      def accepted?
        ActiveModel::Type::Boolean.new.cast(params.expect(:accepted))
      end
    end
  end
end
