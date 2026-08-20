module Api
  module V1
    # ギャラリーの一覧・詳細。
    #   GET /api/v1/galleries                        自分 + お気に入りのフィード（要ログイン）
    #   GET /api/v1/galleries?user_id=xxx            指定ユーザーの作品一覧（公開）
    #   GET /api/v1/galleries?user_id=xxx&tag=漆器   タグで絞り込み
    #   GET /api/v1/galleries/:id                    作品詳細
    class GalleriesController < BaseController
      allow_unauthenticated_access only: %i[index show]

      def index
        return on_authentication_required if params[:user_id].blank? && !Current.logged_in?

        render_collection(GallerySerializer.from_feed(feed))
      end

      def show
        gallery = Gallery.find(params[:id])
        detail = GalleryDetailQueryService.build(gallery, viewer_id: Current.user_id)

        render json: GalleryDetailSerializer.new(detail).serializable_hash
      end

      private

      def feed
        return tagged_feed if params[:tag].present?

        target_ids = params[:user_id].presence || Favorite.self_and_favorite_ids(Current.user_id)
        GalleryFeedQueryService.build(target_ids: target_ids, viewer_id: Current.user_id)
      end

      # タグ検索は「特定ユーザーの作品をタグで絞る」用途のみ（HTML 版と同じ）
      def tagged_feed
        galleries = Gallery.tagged_with([params[:tag]], any: true)
                           .includes(:taggings, :tags)
                           .where(user_id: params[:user_id])
        gallery_ids = galleries.map(&:id)

        {
          galleries: galleries,
          good_count: GalleryGood.where(gallery_id: gallery_ids).group(:gallery_id).count,
          my_good_ids: my_good_ids(gallery_ids),
        }
      end

      def my_good_ids(gallery_ids)
        return Set.new unless Current.logged_in?

        GalleryGood.where(gallery_id: gallery_ids, user_id: Current.user_id).pluck(:gallery_id).to_set
      end
    end
  end
end
