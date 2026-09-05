class ApplicationController < ActionController::Base
  include Pagy::Method
  include Authentication

  rescue_from ActiveRecord::RecordNotFound, with: :render_404
  rescue_from ActiveRecord::InvalidForeignKey, with: :render_404
  rescue_from ActionController::ParameterMissing, with: :render_400
  rescue_from Pagy::RangeError, with: :render_pagy_overflow

  def render_404
    respond_to do |format|
      format.html { render template: 'errors/error_404', status: :not_found, layout: 'application', content_type: 'text/html' }
      format.json { render json: { error: 'Not Found' }, status: :not_found }
    end
  end

  def render_500
    respond_to do |format|
      format.html { render template: 'errors/error_500', status: :internal_server_error, layout: 'application', content_type: 'text/html' }
      format.json { render json: { error: 'Internal Server Error' }, status: :internal_server_error }
    end
  end

  private

  # ── Authentication のフック実装（HTML 版）─────────────────────────
  # 既定（Authentication 側）はステータスコードのみを返す API 向けの実装なので、
  # HTML を返すこちらでは redirect + flash に差し替える。

  def on_session_expired
    respond_to do |format|
      format.html { redirect_to '/index', flash: { danger: t('flash.danger.session_expired') } }
      format.json { head :unauthorized }
    end
  end

  def on_authentication_required
    respond_to do |format|
      format.html { redirect_to '/index', flash: { danger: t('flash.danger.require_login') } }
      format.json { head :unauthorized }
    end
  end

  # 権限不足はトップへ戻す（HTML では 403 の専用画面を持たないため）
  def on_authorization_failed
    respond_to do |format|
      format.html { redirect_to '/index' }
      format.json { head :forbidden }
    end
  end

  # ── エラーレスポンス ──────────────────────────────────────────────

  def render_400
    respond_to do |format|
      format.html do
        flash[:danger] = t('flash.danger.invalid_request')
        redirect_to '/index'
      end
      format.json { render json: { error: 'Bad Request' }, status: :bad_request }
    end
  end

  # ?page=999 のような範囲外ページ指定時、有効な最終ページへリダイレクトする
  def render_pagy_overflow(exception)
    query = request.query_parameters.merge('page' => exception.pagy.last).to_query
    redirect_to "#{request.path}?#{query}"
  end

  def pagination_props(pagy)
    { currentPage: pagy.page, totalPages: pagy.pages, totalCount: pagy.count }
  end

  # ログイン中ユーザー。未ログインなら nil（フロント側で `currentUser && ...` の分岐に使う）
  def current_user_props
    CurrentUserSerializer.render(Current.user)
  end
end
