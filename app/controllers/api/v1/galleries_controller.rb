module Api
  module V1
    # ギャラリーの一覧・詳細。
    #   GET /api/v1/galleries                        自分 + お気に入りのフィード（要ログイン）
    #   GET /api/v1/galleries?user_id=xxx            指定ユーザーの作品一覧（公開）
    #   GET /api/v1/galleries?user_id=xxx&tag=漆器   タグで絞り込み
    #   GET /api/v1/galleries/:id                    作品詳細
    #   POST /api/v1/galleries                       作品投稿(multipart/form-data)
    class GalleriesController < BaseController
      allow_unauthenticated_access only: %i[index show]
      before_action :require_creator, only: :create

      def index
        return on_authentication_required if params[:user_id].blank? && !Current.logged_in?

        render_collection(GallerySerializer.from_feed(feed))
      end

      def show
        gallery = Gallery.find(params.expect(:id))
        detail = GalleryDetailQueryService.build(gallery, viewer_id: Current.user_id)

        render json: GalleryDetailSerializer.new(detail).serializable_hash
      end

      # 画像は CarrierWave が受け取るため multipart/form-data で送る必要がある。
      # JSON でファイル名の文字列を渡されても CarrierWave は受け付けられないので、
      # 早い段階で 400 として弾く。
      def create
        return render_not_multipart unless uploaded_file?(params.dig(:gallery, :data))

        gallery = Gallery.new(gallery_params.merge(user_id: Current.user_id))
        return render_validation_failure(gallery) unless gallery.save

        render json: GallerySerializer.new(gallery).serializable_hash, status: :created
      end

      private

      def gallery_params
        params.expect(gallery: %i[data comment tag_list])
      end

      def uploaded_file?(value)
        value.respond_to?(:tempfile)
      end

      def render_not_multipart
        render_error('not_multipart',
                     '画像は multipart/form-data で送信してください',
                     status: :bad_request)
      end

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
