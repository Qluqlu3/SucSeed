module Api
  module V1
    # パスワード再設定。HTML の UserController#email_exist / password_edit / password_reset を置き換える。
    #
    # トークンは has_secure_password（reset_token）の署名付きトークンで、DB には持たない。
    # 期限切れ・改竄・存在しないユーザーはどれも find_by_password_reset_token が nil を返し、
    # 区別せずに 404（invalid_token）にする。
    # パスワードが変わるとトークンに埋め込まれた password_salt も変わるので、使ったリンクは二度使えない。
    class PasswordResetsController < BaseController
      allow_unauthenticated_access

      before_action :set_user_by_token, only: %i[show update]

      # 再設定画面を開いたときにリンクが有効かを確かめる
      def show
        head :no_content
      end

      # 再設定のメールを送る。メールアドレスが登録済みかどうかを漏らさないよう、
      # 未登録でも送信に失敗しても同じ 202 を返す
      def create
        email = params[:email].to_s
        if email.blank?
          return render_error('unprocessable_entity', I18n.t('flash.danger.email_blank'),
                              status: :unprocessable_content)
        end

        send_reset_mail(User.find_by(email: email))
        head :accepted
      end

      def update
        password_params = params.expect(user: %i[password password_confirmation])
        # has_secure_password は空文字のパスワードを「変更なし」として黙って無視するため、
        # 空のまま送ると変わっていないのに成功してしまう（Rails 版はそうなっていた）
        if password_params[:password].blank?
          @user.errors.add(:password, :blank)
          return render_validation_failure(@user)
        end
        return render_validation_failure(@user) unless @user.update(password_params)

        head :no_content
      end

      private

      def set_user_by_token
        @user = User.find_by_password_reset_token(params[:token])
        return if @user

        render_error('invalid_token', I18n.t('flash.danger.invalid_link'), status: :not_found)
      end

      def send_reset_mail(user)
        return if user.nil?

        GmailMailer.send_password_reset(user).deliver_now
      rescue StandardError => e
        # 失敗を応答に出すと「そのアドレスは登録済み」と分かってしまうので、記録だけ残す
        Rails.error.report(e, handled: true)
      end
    end
  end
end
