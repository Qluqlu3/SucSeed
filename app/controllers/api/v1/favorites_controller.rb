module Api
  module V1
    # お気に入り（後継者が気になる職人を登録する）。
    # :id には相手ユーザーの id を渡す。
    class FavoritesController < BaseController
      PER_PAGE = 20

      def index
        scope = Favorite.where(user_id: Current.user_id)
                        .includes(favorite_user: :creator)
                        .order(created_at: :desc)
        pagy, favorites = paginate(scope, default_limit: PER_PAGE)

        render_collection(
          PublicUserSerializer.new(favorites.map(&:favorite_user)).serializable_hash, pagy: pagy
        )
      end

      def create
        favorite = Favorite.new(user_id: Current.user_id, favorite_user_id: params[:id])
        return render_validation_failure(favorite) unless favorite.save

        render json: { favorited: true, userId: params[:id] }, status: :created
      end

      def destroy
        Favorite.where(user_id: Current.user_id, favorite_user_id: params[:id]).delete_all

        # 冪等に扱う。既に解除済みでも 404 ではなく「解除されている」状態を返す。
        render json: { favorited: false, userId: params[:id] }
      end
    end
  end
end
