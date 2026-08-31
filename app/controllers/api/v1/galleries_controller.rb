module Api
  module V1
    # ギャラリーの一覧・詳細。
    #   GET /api/v1/galleries                        自分 + お気に入りのフィード（要ログイン）
    #   GET /api/v1/galleries?user_id=xxx            指定ユーザーの作品一覧（公開）
    #   GET /api/v1/galleries?user_id=xxx&tag=漆器   タグで絞り込み
    #   GET /api/v1/galleries/:id                    作品詳細
    #   POST /api/v1/galleries                       作品投稿(multipart/form-data)
    class GalleriesController < BaseController
      # サムネイルのグリッド表示なので日記より多めに返す
      PER_PAGE = 24

      allow_unauthenticated_access only: %i[index show]
      before_action :require_creator, only: :create

      rate_limit_per_user to: 10, within: 10.minutes, only: :create

      def index
        return on_authentication_required if params[:user_id].blank? && !Current.logged_in?

        pagy, galleries = paginate(feed_scope, default_limit: PER_PAGE)
        feed = GalleryFeedQueryService.build(galleries: galleries, viewer_id: Current.user_id)

        render_collection(GallerySerializer.from_feed(feed), pagy: pagy)
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

      # tag 指定はタグ検索（特定ユーザーの作品をタグで絞る）、
      # user_id 指定はそのユーザーの作品、いずれも無ければ自分 + お気に入りのフィード
      def feed_scope
        target_ids = params[:user_id].presence || Favorite.self_and_favorite_ids(Current.user_id)
        if params[:tag].present?
          return GalleryFeedQueryService.tagged_scope_for(target_ids, params[:tag])
        end

        GalleryFeedQueryService.scope_for(target_ids)
      end
    end
  end
end
