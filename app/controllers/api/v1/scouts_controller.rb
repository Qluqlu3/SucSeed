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

      def index
        render_collection(MatchSerializer.build(Current.creator? ? sent_scouts : received_scouts))
      end

      def create
        # matches は「user_id = 後継者 / target_user_id = 職人」で向きが固定されている。
        # スカウトは職人発だが、格納する向きはアピールと同じになる点に注意。
        scout = Match.new(user_id: params[:heir_id], target_user_id: Current.user_id, is_scout: true)
        return render_validation_failure(scout) unless scout.save

        render json: MatchSerializer.build([scout]).first, status: :created
      end

      def update
        scout = Match.find_by(user_id: Current.user_id, target_user_id: params[:id], is_scout: true)
        return render_not_found if scout.nil?

        scout.update!(is_ok: accepted?)
        render json: MatchSerializer.build([scout]).first
      end

      private

      # 職人から見た「自分が声を掛けた後継者」
      def sent_scouts
        Match.includes(:user, :target_user)
             .where(target_user_id: Current.user_id, is_scout: true)
             .order(created_at: :asc)
      end

      # 後継者から見た「自分に来た、まだ回答していないスカウト」
      def received_scouts
        Match.includes(:user, :target_user)
             .where(user_id: Current.user_id, is_scout: true, is_ok: nil)
             .order(created_at: :asc)
      end

      def accepted?
        ActiveModel::Type::Boolean.new.cast(params.expect(:accepted))
      end
    end
  end
end
