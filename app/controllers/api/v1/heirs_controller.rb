module Api
  module V1
    # 後継者のページ（/page/heir/:id）の表現。:id は後継者の user_id。
    #
    # 後継者は「職人でないユーザー」で、詳細プロフィール（heirs）を登録していなくても
    # アピールでき、職人のアピールリストから /page/heir/:id へ飛べる。そのため heirs の行が
    # 無くても返し（分野などは null）、職人のユーザーなら 404 にする。
    class HeirsController < BaseController
      allow_unauthenticated_access

      def show
        user = User.where(is_creator: false).includes(heir: :art_category).find(params.expect(:id))

        render json: HeirSerializer.new(user, params: viewer_params(user)).serializable_hash
      end

      private

      # matches は user_id = 後継者 / target_user_id = 職人 で、(user_id, target_user_id) が一意。
      # 閲覧者（職人）との間にアピールでもスカウトでも既に行があれば、新しくスカウトしても
      # 一意制約で弾かれるので「スカウト済み」として返す（Rails の /page/heir/:id と同じ）
      def viewer_params(user)
        return { viewer_id: nil } unless Current.logged_in?

        scouted = Match.where(user_id: user.id, target_user_id: Current.user_id).pluck(:user_id).to_set
        { viewer_id: Current.user_id, scouted_user_ids: scouted }
      end
    end
  end
end
