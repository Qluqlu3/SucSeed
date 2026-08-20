module Api
  module V1
    # ギャラリーへの「いいね」。
    #   POST   /api/v1/galleries/:gallery_id/good
    #   DELETE /api/v1/galleries/:gallery_id/good
    class GalleryGoodsController < BaseController
      before_action :set_gallery

      def create
        good = GalleryGood.new(gallery_id: @gallery.id, user_id: Current.user_id)
        return render json: good_state, status: :ok if already_liked?
        return render_validation_failure(good) unless good.save

        render json: good_state, status: :created
      end

      def destroy
        GalleryGood.where(gallery_id: @gallery.id, user_id: Current.user_id).delete_all
        render json: good_state
      end

      private

      def set_gallery
        @gallery = Gallery.find(params[:gallery_id])
      end

      def already_liked?
        GalleryGood.exists?(gallery_id: @gallery.id, user_id: Current.user_id)
      end

      def good_state
        {
          galleryId: @gallery.id,
          goodCount: GalleryGood.where(gallery_id: @gallery.id).count,
          myGood: already_liked?,
        }
      end
    end
  end
end
