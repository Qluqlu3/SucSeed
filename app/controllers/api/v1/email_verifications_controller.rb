module Api
  module V1
    # メールアドレス認証。HTML の UserController#email_certified_show / email_certified を置き換える。
    #
    # トークンは User の generates_token_for(:email_verification)（24時間・メールアドレスに紐づく）。
    # 期限切れと改竄・存在しないユーザーは区別できず、区別しない方が総当たりの手がかりも与えないので、
    # どれも 404（invalid_token）にする。
    class EmailVerificationsController < BaseController
      allow_unauthenticated_access

      before_action :set_user_by_token

      # 認証画面に出す名前。認証済みかどうかは認証するときに伝える（Rails 版と同じ）
      def show
        render json: { userName: @user.name }
      end

      def update
        if @user.is_certified?
          return render_error('already_certified', I18n.t('flash.danger.email_already_certified'),
                              status: :conflict)
        end
        unless @user.update(is_certified: true)
          return render_error('unprocessable_entity', I18n.t('flash.danger.email_certified_error'),
                              status: :unprocessable_content, details: @user.errors.full_messages)
        end

        head :no_content
      end

      private

      def set_user_by_token
        @user = User.find_by_email_verification_token(params[:token])
        return if @user

        render_error('invalid_token', I18n.t('flash.danger.email_token_invalid'), status: :not_found)
      end
    end
  end
end
