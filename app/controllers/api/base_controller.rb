module Api
  # JSON API の基底クラス。
  #
  # ActionController::Base ではなく ActionController::API を親にしているのは、
  # ビュー描画・flash・Cookie 以外のミドルウェアを読み込まないため。
  # ただし本 API は同一オリジンの React island からセッション Cookie で叩かれるので、
  # Cookie と CSRF 保護だけは明示的に取り込んでいる。
  #
  # 方針:
  #   - 認証は既定で必須。公開エンドポイントだけが allow_unauthenticated_access を宣言する
  #   - 失敗時は必ず { error: { code:, message:, details: } } の形で返す
  #   - 成功時のペイロード整形は app/serializers に委ねる
  class BaseController < ActionController::API
    include ActionController::Cookies
    include ActionController::RequestForgeryProtection
    include Authentication
    include ApiRateLimiting
    include Pagy::Method

    # ActionController::API は既定で CSRF 保護を入れないため明示的に有効化する。
    # Cookie セッションで認証する以上、これが無いと CSRF が成立してしまう。
    protect_from_forgery with: :exception

    # config.action_controller.allow_forgery_protection は ActionController::Base にしか
    # 適用されない（API は RequestForgeryProtection を持たないため設定がスキップされる）。
    # テスト環境で CSRF を無効化する設定などを取りこぼさないよう、HTML 側と同じ値を引き継ぐ。
    self.allow_forgery_protection = ActionController::Base.allow_forgery_protection

    before_action :require_login

    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :render_record_invalid
    rescue_from ActionController::ParameterMissing, with: :render_parameter_missing
    rescue_from ActionController::InvalidAuthenticityToken, with: :render_invalid_csrf
    rescue_from Pagy::RangeError, with: :render_page_out_of_range

    # 件数の上限。クライアントが ?per_page= で増やせるが、ここで打ち止めにする。
    MAX_PER_PAGE = 100

    private

    # ── 成功レスポンス ────────────────────────────────────────────────

    # コレクション用。ページネーション情報は指定があるときだけ含める。
    def render_collection(items, pagy: nil, status: :ok)
      payload = { items: items }
      payload[:pagination] = pagination_payload(pagy) if pagy
      render json: payload, status: status
    end

    def pagination_payload(pagy)
      { currentPage: pagy.page, totalPages: pagy.pages, totalCount: pagy.count }
    end

    # 一覧エンドポイント共通のページネーション。
    #
    # 件数無制限の一覧はデータが増えるほどレスポンスが膨らみ、
    # DB もアプリもクライアントも巻き込んで遅くなるため、
    # 一覧を返す API は必ずこれを通す。
    #
    # @param default_limit [Integer] クライアントが指定しなかった場合の1ページ件数
    def paginate(scope, default_limit:)
      pagy(scope, limit: requested_per_page(default_limit))
    end

    def requested_per_page(default_limit)
      requested = params[:per_page].presence&.to_i
      return default_limit if requested.nil? || requested <= 0

      [requested, MAX_PER_PAGE].min
    end

    # ── エラーレスポンス ──────────────────────────────────────────────

    # 全エラーをこの形に揃える。フロントは code だけ見れば分岐できる。
    def render_error(code, message, status:, details: [])
      render json: { error: { code: code, message: message, details: details } }, status: status
    end

    def render_not_found(_exception = nil)
      render_error('not_found', 'リソースが見つかりません', status: :not_found)
    end

    def render_record_invalid(exception)
      render_error('unprocessable_entity', '入力内容を確認してください',
                   status: :unprocessable_content, details: exception.record.errors.full_messages)
    end

    # 保存に失敗した AR オブジェクトをそのまま 422 にする（save の戻り値で分岐する箇所用）
    def render_validation_failure(record)
      render_error('unprocessable_entity', '入力内容を確認してください',
                   status: :unprocessable_content, details: record.errors.full_messages)
    end

    def render_parameter_missing(exception)
      render_error('bad_request', "必須パラメータが不足しています: #{exception.param}",
                   status: :bad_request)
    end

    def render_invalid_csrf(_exception)
      render_error('invalid_authenticity_token', 'セッションが無効です。ページを再読み込みしてください',
                   status: :unprocessable_content)
    end

    def render_page_out_of_range(_exception)
      render_error('page_out_of_range', '指定されたページは存在しません', status: :not_found)
    end

    # ── Authentication のフック実装（JSON 版）─────────────────────────

    def on_session_expired
      render_error('session_expired', 'セッションの有効期限が切れました', status: :unauthorized)
    end

    def on_authentication_required
      render_error('unauthorized', 'ログインが必要です', status: :unauthorized)
    end

    def on_authorization_failed
      render_error('forbidden', 'この操作を行う権限がありません', status: :forbidden)
    end
  end
end
