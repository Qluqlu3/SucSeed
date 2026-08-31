module Api
  module V1
    # 日記の一覧・投稿・削除。
    #   GET    /api/v1/diaries              自分 + お気に入り登録した相手のフィード（要ログイン）
    #   GET    /api/v1/diaries?user_id=xxx  指定ユーザーの日記（公開）
    #   POST   /api/v1/diaries              投稿（職人のみ）
    #   DELETE /api/v1/diaries/:id          自分の投稿を論理削除
    class DiariesController < BaseController
      # 1件あたりコメントといいねを含むため、ページサイズは小さめにしている
      PER_PAGE = 10

      allow_unauthenticated_access only: :index
      before_action :require_creator, only: :create

      # 投稿スパム対策。IP 単位の Rack::Attack と重ねてユーザー単位でも絞る
      rate_limit_per_user to: 10, within: 10.minutes, only: :create

      def index
        return on_authentication_required if params[:user_id].blank? && !Current.logged_in?

        pagy, diaries = paginate(DiaryFeedQueryService.scope_for(target_ids), default_limit: PER_PAGE)
        feed = DiaryFeedQueryService.build(diaries: diaries, viewer_id: Current.user_id,
                                           sample_good_avatars: params[:user_id].present?)

        render_collection(DiarySerializer.from_feed(feed), pagy: pagy)
      end

      def create
        diary = Diary.new(diary_params.merge(user_id: Current.user_id))
        return render_validation_failure(diary) unless diary.save

        render json: DiarySerializer.for_new_record(diary.tap { |d| d.user = Current.user }),
               status: :created
      end

      def destroy
        diary = Diary.find_by(id: params.expect(:id), user_id: Current.user_id)
        # 他人の日記を消そうとした場合も「見つからない」で統一し、存在を漏らさない
        return render_not_found if diary.nil?

        diary.soft_delete
        head :no_content
      end

      private

      # user_id 指定があればそのユーザー、無ければ自分 + お気に入り登録した相手
      def target_ids
        params[:user_id].presence || Favorite.self_and_favorite_ids(Current.user_id)
      end

      def diary_params
        params.expect(diary: [:content])
      end
    end
  end
end
