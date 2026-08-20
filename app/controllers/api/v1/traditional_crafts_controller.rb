module Api
  module V1
    # 伝統工芸品マスタ。地図ページの読み物セクションで使う。
    class TraditionalCraftsController < BaseController
      allow_unauthenticated_access

      def index
        crafts = TraditionalCraft.includes(:art_category).order(:prefecture_code, :id)
        render_collection(TraditionalCraftSerializer.build(crafts))
      end
    end
  end
end
