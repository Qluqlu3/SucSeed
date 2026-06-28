class ApplicationController < ActionController::Base
  SESSION_TIMEOUT = 2.hours

  before_action :check_session_timeout

  rescue_from ActiveRecord::RecordNotFound, with: :render_404
  rescue_from ActionController::ParameterMissing, with: :render_400

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

  def check_session_timeout
    return if session[:id].blank?

    if session[:last_active_at].present? && session[:last_active_at] < SESSION_TIMEOUT.ago
      reset_session
      respond_to do |format|
        format.html { redirect_to '/index', flash: { danger: 'セッションの有効期限が切れました。再度ログインしてください。' } }
        format.json { head :unauthorized }
      end
    else
      session[:last_active_at] = Time.current
    end
  end

  def require_login
    return if session[:id].present?

    respond_to do |format|
      format.html { redirect_to '/index', flash: { danger: 'ログインしてください' } }
      format.json { head :unauthorized }
    end
  end

  def render_400
    respond_to do |format|
      format.html do
        flash[:danger] = '不正なリクエストです'
        redirect_to '/index'
      end
      format.json { render json: { error: 'Bad Request' }, status: :bad_request }
    end
  end
end
