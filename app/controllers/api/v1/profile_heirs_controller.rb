module Api
  module V1
    # ログイン中の後継者自身の詳細プロフィール（heirs）。職人でないユーザーだけが使える。
    #
    #   GET   /api/v1/profile/heir   未登録なら 404（画面は登録フォームを出す）
    #   POST  /api/v1/profile/heir   登録。登録済みなら 409
    #   PATCH /api/v1/profile/heir   更新。未登録なら 404
    #
    # body: { heir: { art_category_id, introduction } }
    class ProfileHeirsController < BaseController
      before_action :require_non_creator

      def show
        own_heir!
        render_heir
      end

      # heirs に user_id の一意制約は無いので、二重送信で2行できないようここで弾く
      def create
        return render_already_registered if Heir.exists?(user_id: Current.user_id)

        heir = Heir.new(heir_params.merge(user_id: Current.user_id))
        return render_validation_failure(heir) unless heir.save

        render_heir(status: :created)
      end

      def update
        heir = own_heir!
        return render_validation_failure(heir) unless heir.update(heir_params)

        render_heir
      end

      private

      def own_heir!
        Heir.find_by!(user_id: Current.user_id)
      end

      def heir_params
        params.expect(heir: %i[art_category_id introduction])
      end

      # 後継者ページ（GET /api/v1/heirs/:id）と同じ表現。入力は User なので読み直して渡す
      def render_heir(status: :ok)
        user = User.includes(heir: :art_category).find(Current.user_id)
        render json: HeirSerializer.new(user, params: { viewer_id: Current.user_id }).serializable_hash,
               status: status
      end

      def render_already_registered
        render_error('already_registered', '後継者の詳細プロフィールは登録済みです', status: :conflict)
      end
    end
  end
end
