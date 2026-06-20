class ApplicationController < ActionController::Base
  def render_404
    render template: 'errors/error_404', status: :not_found, layout: 'application', content_type: 'text/html'
  end
end
