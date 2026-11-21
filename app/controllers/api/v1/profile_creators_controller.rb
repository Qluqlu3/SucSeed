module Api
  module V1
    # ログイン中の職人自身の詳細プロフィール（creators）。職人だけが使える。
    #
    #   GET   /api/v1/profile/creator   未登録なら 404（画面は登録フォームを出す）
    #   POST  /api/v1/profile/creator   登録。登録済みなら 409
    #   PATCH /api/v1/profile/creator   更新。未登録なら 404
    #
    # body: { creator: { title, art_category_id, establishment, employee, postal_code, is_recruitment } }
    class ProfileCreatorsController < BaseController
      before_action :require_creator

      def show
        render_creator(own_creator!)
      end

      # creators に user_id の一意制約は無いので、二重送信で2行できないようここで弾く
      def create
        return render_already_registered if Creator.exists?(user_id: Current.user_id)

        creator = Creator.new(creator_params.merge(user_id: Current.user_id))
        return render_validation_failure(creator) unless creator.save

        render_creator(creator, status: :created)
      end

      def update
        creator = own_creator!
        return render_validation_failure(creator) unless creator.update(creator_params)

        render_creator(creator)
      end

      private

      def own_creator!
        Creator.includes(:user, :art_category).find_by!(user_id: Current.user_id)
      end

      def creator_params
        params.expect(creator: %i[title art_category_id establishment employee postal_code is_recruitment])
      end

      # 職人ページ（GET /api/v1/creators/:id）と同じ表現。本人なので isOwn だけが true になる
      def render_creator(creator, status: :ok)
        render json: CreatorSerializer.new(creator, params: { viewer_id: Current.user_id }).serializable_hash,
               status: status
      end

      def render_already_registered
        render_error('already_registered', '職人の詳細プロフィールは登録済みです', status: :conflict)
      end
    end
  end
end
