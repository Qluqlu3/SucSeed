module Api
  module V1
    # ログイン中ユーザー自身のプロフィール。
    class ProfileController < BaseController
      def show
        render json: ProfileSerializer.render(Current.user)
      end

      # 名前/メール/自己紹介は JSON で、アバター画像は multipart/form-data で受け付ける。
      def update
        avatar = params.dig(:user, :avatar_path)
        return render_not_multipart if avatar.present? && !uploaded_file?(avatar)

        return render_validation_failure(Current.user) unless Current.user.update(profile_params)

        render json: ProfileSerializer.render(Current.user)
      end

      private

      def profile_params
        params.expect(user: %i[name email profile avatar_path])
      end
    end
  end
end
