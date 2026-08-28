module Api
  module V1
    # 日記への「いいね」。
    #   POST   /api/v1/diaries/:diary_id/good
    #   DELETE /api/v1/diaries/:diary_id/good
    #
    # HTML 版は登録しかできず取り消せなかったが、API ではトグルできるようにしている。
    class DiaryGoodsController < BaseController
      before_action :set_diary

      def create
        good = DiaryGood.new(diary_id: @diary.id, user_id: Current.user_id)
        # 二重いいねはユニーク検証で弾かれる。既にいいね済みなら現在の状態をそのまま返す。
        return render json: good_state, status: :ok if already_liked?
        return render_validation_failure(good) unless good.save

        render json: good_state, status: :created
      end

      def destroy
        DiaryGood.where(diary_id: @diary.id, user_id: Current.user_id).delete_all
        render json: good_state
      end

      private

      def set_diary
        @diary = Diary.find(params.expect(:diary_id))
      end

      def already_liked?
        DiaryGood.exists?(diary_id: @diary.id, user_id: Current.user_id)
      end

      def good_state
        {
          diaryId: @diary.id,
          goodCount: DiaryGood.where(diary_id: @diary.id).count,
          myGood: already_liked?,
        }
      end
    end
  end
end
