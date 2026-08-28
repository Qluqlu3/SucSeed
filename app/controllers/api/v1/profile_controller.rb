module Api
  module V1
    # ログイン中ユーザー自身のプロフィール。
    class ProfileController < BaseController
      def show
        render json: profile_payload
      end

      def update
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

      # アバター画像は multipart でないと CarrierWave が受け取れない（文字列を渡すと
      # CarrierWave::FormNotMultipart が飛ぶ）ため、JSON API では扱わない。
      # 画像の差し替えは従来どおり PATCH /my_page/update（フォーム送信）を使う。
      def profile_params
        params.expect(user: %i[name email profile])
      end
    end
  end
end
