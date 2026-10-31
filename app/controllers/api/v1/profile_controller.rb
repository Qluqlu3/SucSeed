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
        return render_not_multipart if avatar.present? && !avatar.respond_to?(:tempfile)

        return render_validation_failure(Current.user) unless Current.user.update(profile_params)

        render json: ProfileSerializer.render(Current.user)
      end

      private

      def profile_params
        params.expect(user: %i[name email profile avatar_path])
      end

      # CarrierWave は multipart で送られた UploadedFile しか受け取れず、
      # 文字列を渡すと CarrierWave::FormNotMultipart で 500 になる。
      def render_not_multipart
        render_error('not_multipart',
                     '画像は multipart/form-data で送信してください',
                     status: :bad_request)
      end
    end
  end
end
