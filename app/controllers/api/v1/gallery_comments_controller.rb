module Api
  module V1
    # ギャラリーへのコメント投稿。
    #   POST /api/v1/galleries/:gallery_id/comments
    class GalleryCommentsController < BaseController
      rate_limit_per_user to: 20, within: 5.minutes, only: :create

      def create
        gallery = Gallery.find(params.expect(:gallery_id))
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
        params.expect(gallery_comment: [:comment])
      end
    end
  end
end
