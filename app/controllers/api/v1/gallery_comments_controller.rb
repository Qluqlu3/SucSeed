module Api
  module V1
    # ギャラリーへのコメント投稿。
    #   POST /api/v1/galleries/:gallery_id/comments
    class GalleryCommentsController < BaseController
      def create
        gallery = Gallery.find(params[:gallery_id])
        comment = GalleryComment.new(comment_params.merge(gallery_id: gallery.id, user_id: Current.user_id))
        return render_validation_failure(comment) unless comment.save

        comment.user = Current.user
        render json: {
          comment: CommentSerializer.new(comment).serializable_hash,
          commentCount: GalleryComment.where(gallery_id: gallery.id).count,
        }, status: :created
      end

      private

      def comment_params
        params.require(:gallery_comment).permit(:comment)
      end
    end
  end
end
