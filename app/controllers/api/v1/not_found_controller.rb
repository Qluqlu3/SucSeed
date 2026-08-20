module Api
  module V1
    # /api/* の未定義パスを HTML の 404 ページではなく JSON で返すための終端。
    class NotFoundController < BaseController
      allow_unauthenticated_access
      skip_before_action :verify_authenticity_token

      def show
        render_not_found
      end
    end
  end
end
