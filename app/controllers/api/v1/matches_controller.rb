module Api
  module V1
    # 成立したマッチング一覧（アピール/スカウトのどちらでも is_ok = true になったもの）。
    class MatchesController < BaseController
      PER_PAGE = 20

      def index
        scope = Match.accepted.involving(Current.user).with_active_parties.order(created_at: :desc)
        pagy, matches = paginate(scope, default_limit: PER_PAGE)

        render_collection(MatchSerializer.build(matches), pagy: pagy)
      end
    end
  end
end
