module Api
  module V1
    # 成立したマッチング一覧（アピール/スカウトのどちらでも is_ok = true になったもの）。
    class MatchesController < BaseController
      def index
        column = Current.creator? ? :target_user_id : :user_id
        matches = Match.includes(:user, :target_user)
                       .where(column => Current.user_id, :is_ok => true)
                       .order(created_at: :desc)

        render_collection(MatchSerializer.build(matches))
      end
    end
  end
end
