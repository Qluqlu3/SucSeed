module Api
  module V1
    # 日記へのコメント投稿。
    #   POST /api/v1/diaries/:diary_id/comments
    class DiaryCommentsController < BaseController
      def create
        diary = Diary.find(params[:diary_id])
        comment = DiaryComment.new(comment_params.merge(diary_id: diary.id, user_id: Current.user_id))
        return render_validation_failure(comment) unless comment.save

        comment.user = Current.user
        render json: {
          comment: CommentSerializer.new(comment).serializable_hash,
          commentCount: DiaryComment.where(diary_id: diary.id).count,
        }, status: :created
      end

      private

      def comment_params
        params.require(:diary_comment).permit(:comment)
      end
    end
  end
end
