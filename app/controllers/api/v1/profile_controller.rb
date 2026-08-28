module Api
  module V1
    # ログイン中ユーザー自身のプロフィール。
    class ProfileController < BaseController
      def show
        render json: profile_payload
      end

      # 名前/メール/自己紹介は JSON で、アバター画像は multipart/form-data で受け付ける。
      def update
        avatar = params.dig(:user, :avatar_path)
        return render_not_multipart if avatar.present? && !avatar.respond_to?(:tempfile)

        return render_validation_failure(Current.user) unless Current.user.update(profile_params)

        render json: profile_payload
      end

      private

      def profile_payload
        user = Current.user
        {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          avatarPath: user.avatar_path.to_s,
          isMan: user.is_man,
          birthday: user.birthday.to_s,
          isCertified: user.is_certified,
          role: Current.role,
          # 職人/後継者の詳細プロフィールが未登録なら、フロントが登録導線を出せるようにする
          detailRegistered: detail_registered?,
        }
      end

      def detail_registered?
        if Current.creator?
          Creator.exists?(user_id: Current.user_id)
        else
          Heir.exists?(user_id: Current.user_id)
        end
      end

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
