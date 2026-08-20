module Api
  module V1
    # 工芸分野のマスタ一覧。検索フォームや登録フォームの選択肢に使う。
    class ArtCategoriesController < BaseController
      allow_unauthenticated_access

      def index
        render_collection(ArtCategorySerializer.new(ArtCategory.order(:id)).serializable_hash)
      end
    end
  end
end
