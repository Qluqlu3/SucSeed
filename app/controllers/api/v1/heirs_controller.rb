module Api
  module V1
    # 後継者プロフィールの詳細。:id は後継者の user_id。
    class HeirsController < BaseController
      allow_unauthenticated_access

      def show
        heir = Heir.includes(:user, :art_category).find_by!(user_id: params[:id])

        render json: HeirSerializer.new(heir, params: viewer_params(heir)).serializable_hash
      end

      private

      def viewer_params(heir)
        return { viewer_id: nil } unless Current.logged_in?

        scouted = Match.where(user_id: heir.user_id, target_user_id: Current.user_id, is_scout: true)
                       .pluck(:user_id).to_set
        { viewer_id: Current.user_id, scouted_user_ids: scouted }
      end
    end
  end
end
