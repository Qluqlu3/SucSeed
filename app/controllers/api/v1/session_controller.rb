module Api
  module V1
    # ログイン状態の取得 / ログイン / ログアウト。
    # レイアウト（Navbar・Footer）が起動時に1回叩く、フロントのブートストラップ用でもある。
    class SessionController < BaseController
      # ログアウトは冪等に扱いたいので、未ログインでも 401 にせず現在の状態を返す
      allow_unauthenticated_access

      # メールアドレス単位のログイン試行制限（HTML の UserController#login と共通）
      limit_login_attempts_per_email only: :create

      def show
        render json: session_payload
      end

      def create
        # authenticate_by はメールアドレスが存在しない場合もダミーのハッシュ計算を行うため、
        # 応答時間からアカウントの存在有無を推測されるのを防げる。
        # メールアドレスの正規化(downcase)は User の normalizes が担当する。
        user = User.authenticate_by(email: login_params[:email], password: login_params[:password])

        unless user
          # メールアドレスの存在有無を漏らさないため、どちらの失敗でも同じ応答にする
          return render_error('invalid_credentials', 'メールアドレスまたはパスワードが違います',
                              status: :unauthorized)
        end

        start_new_session_for(user)
        user.update_column(:login_time, Time.current)
        render json: session_payload, status: :created
      end

      def destroy
        terminate_session
        render json: session_payload
      end

      private

      def session_payload
        {
          loggedIn: Current.logged_in?,
          userId: Current.user_id,
          role: Current.role,
          # ログアウト直後などセッションが張り替わった際に、フロントが新しいトークンを
          # 取り直せるよう毎回返す
          csrfToken: form_authenticity_token,
          layoutAssets: {
            logoSrc: asset_url_for('logo.png'),
            titleSrc: asset_url_for('title.png'),
          },
          artCategories: ArtCategorySerializer.new(ArtCategory.order(:id)).serializable_hash,
        }
      end

      # ActionController::API はビューコンテキストを持たないため helpers.image_path が使えない。
      # アセットパスの解決だけ ActionController::Base のヘルパーを借りる。
      def asset_url_for(name)
        ActionController::Base.helpers.image_path(name)
      end

      def login_params
        params.expect(session: %i[email password])
      end
    end
  end
end
