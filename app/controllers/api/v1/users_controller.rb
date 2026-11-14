module Api
  module V1
    # 任意のユーザーの公開情報。
    #   GET /api/v1/users/:id
    #
    # 職人/後継者の詳細プロフィール（creators / heirs）は登録していない人もいるため、
    # 「:id の人の日記」「:id の人の作品」の見出しはここから取る。
    class UsersController < BaseController
      allow_unauthenticated_access

      def show
        user = User.includes(:creator).find(params.expect(:id))

        render json: PublicUserPageSerializer.new(user).serializable_hash
      end
    end
  end
end
