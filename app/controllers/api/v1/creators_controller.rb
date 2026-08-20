module Api
  module V1
    # 職人の一覧・詳細。
    #   GET /api/v1/creators                      募集中の職人一覧（ページング）
    #   GET /api/v1/creators?art_category_id=1    分野で絞り込み
    #   GET /api/v1/creators/:id                  :id は職人の user_id
    class CreatorsController < BaseController
      allow_unauthenticated_access

      PER_PAGE = 12

      def index
        scope = RecruitingCreatorsQuery.call(
          art_category_id: params[:art_category_id],
          exclude_user_id: Current.creator? ? Current.user_id : nil,
        )
        pagy, creators = pagy(scope, limit: PER_PAGE)

        render_collection(CreatorCardSerializer.build(creators), pagy: pagy)
      end

      def show
        creator = Creator.includes(:user, :art_category).find_by!(user_id: params[:id])

        render json: CreatorSerializer.new(creator, params: viewer_params(creator)).serializable_hash
      end

      private

      # 「お気に入り済みか」「応募済みか」は閲覧者ごとに変わる。
      # 未ログインなら問い合わせ自体を行わない。
      def viewer_params(creator)
        return { viewer_id: nil } unless Current.logged_in?

        {
          viewer_id: Current.user_id,
          favorited_user_ids: favorited_ids(creator.user_id),
          appealed_user_ids: appealed_ids(creator.user_id),
        }
      end

      def favorited_ids(target_user_id)
        Favorite.where(user_id: Current.user_id, favorite_user_id: target_user_id).pluck(:favorite_user_id).to_set
      end

      def appealed_ids(target_user_id)
        Match.where(user_id: Current.user_id, target_user_id: target_user_id).pluck(:target_user_id).to_set
      end
    end
  end
end
