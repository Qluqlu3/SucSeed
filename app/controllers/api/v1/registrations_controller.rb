module Api
  module V1
    # 会員登録。HTML の UserController#create を置き換える。
    # 登録したらメールアドレス認証のメールを送る（ログインはさせない。Rails 版と同じ）。
    # アバター画像は任意で、付けるときは multipart/form-data で送る。
    class RegistrationsController < BaseController
      allow_unauthenticated_access

      def create
        avatar = params.dig(:user, :avatar_path)
        return render_not_multipart if avatar.present? && !uploaded_file?(avatar)

        user = User.new(registration_params)
        return render_validation_failure(user) unless user.save

        GmailMailer.send_certification(user).deliver_now
        render json: { email: user.email }, status: :created
      end

      private

      def registration_params
        params.expect(user: %i[name avatar_path email birthday password password_confirmation
                               is_man is_creator])
      end
    end
  end
end
