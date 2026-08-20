require 'test_helper'

module Api
  module V1
    class GalleriesControllerTest < ApiTestCase
      setup do
        @creator = build_creator('GalleryCreator')
        @heir = build_heir('GalleryHeir')
      end

      # ── 一覧 ──────────────────────────────────────────────────────

      test 'GET /api/v1/galleries — user_id 指定なし・未ログインは 401' do
        api_get '/api/v1/galleries'
        assert_response :unauthorized
      end

      test 'GET /api/v1/galleries?user_id= — 未ログインでも指定ユーザーの作品が読める' do
        gallery = create_gallery(@creator, comment: '作品A')

        api_get '/api/v1/galleries', params: { user_id: @creator.id }
        assert_response :success
        assert_equal [gallery.id], json['items'].pluck('id')
      end

      test 'GET /api/v1/galleries — 自分とお気に入り登録した相手の作品だけが返る' do
        mine = create_gallery(@heir, comment: '自分の作品')
        Favorite.create!(user_id: @heir.id, favorite_user_id: @creator.id)
        favorited = create_gallery(@creator, comment: 'お気に入りの作品')
        stranger = build_creator('StrangerGal')
        create_gallery(stranger, comment: '無関係な作品')

        api_login(@heir)
        api_get '/api/v1/galleries'
        assert_equal [mine.id, favorited.id].sort, json['items'].pluck('id').sort
      end

      test 'GET /api/v1/galleries — goodCount / myGood が返る' do
        gallery = create_gallery(@creator, comment: '人気作')
        GalleryGood.create!(gallery_id: gallery.id, user_id: @heir.id)

        api_login(@heir)
        api_get '/api/v1/galleries', params: { user_id: @creator.id }
        item = json['items'].first
        assert_equal 1, item['goodCount']
        assert_equal true, item['myGood']
      end

      test 'GET /api/v1/galleries — tag で絞り込める' do
        tagged = create_gallery(@creator, comment: '漆器の作品', tag_list: '漆器')
        create_gallery(@creator, comment: '陶器の作品', tag_list: '陶器')

        api_get '/api/v1/galleries', params: { user_id: @creator.id, tag: '漆器' }
        assert_equal [tagged.id], json['items'].pluck('id')
      end

      test 'GET /api/v1/galleries — 論理削除された作品は含まれない' do
        visible = create_gallery(@creator, comment: '生きている作品')
        create_gallery(@creator, comment: '消した作品').soft_delete

        api_get '/api/v1/galleries', params: { user_id: @creator.id }
        assert_equal [visible.id], json['items'].pluck('id')
      end

      # ── 詳細 ──────────────────────────────────────────────────────

      test 'GET /api/v1/galleries/:id — 作品詳細が返る' do
        gallery = create_gallery(@creator, comment: '詳細を見る作品', tag_list: '漆器')

        api_get "/api/v1/galleries/#{gallery.id}"
        assert_response :success
        assert_equal gallery.id, json['galleryId']
        assert_equal '詳細を見る作品', json['comment']
        assert_equal ['漆器'], json['tags']
        assert_equal @creator.id, json.dig('creator', 'userId')
        assert_equal 'GalleryCreator工房', json.dig('creator', 'title')
      end

      test 'GET /api/v1/galleries/:id — コメントが新しい順で返る' do
        gallery = create_gallery(@creator, comment: '作品')
        GalleryComment.create!(gallery_id: gallery.id, user_id: @heir.id, comment: '古い',
                               created_at: 2.days.ago)
        GalleryComment.create!(gallery_id: gallery.id, user_id: @heir.id, comment: '新しい',
                               created_at: 1.hour.ago)

        api_get "/api/v1/galleries/#{gallery.id}"
        assert_equal %w[新しい 古い], json['comments'].pluck('comment')
      end

      test 'GET /api/v1/galleries/:id — 自分のいいねが myGood に反映される' do
        gallery = create_gallery(@creator, comment: '作品')
        GalleryGood.create!(gallery_id: gallery.id, user_id: @heir.id)

        api_login(@heir)
        api_get "/api/v1/galleries/#{gallery.id}"
        assert_equal 1, json['goodCount']
        assert_equal true, json['myGood']
      end

      test 'GET /api/v1/galleries/:id — 未ログインでは myGood が false' do
        gallery = create_gallery(@creator, comment: '作品')
        GalleryGood.create!(gallery_id: gallery.id, user_id: @heir.id)

        api_get "/api/v1/galleries/#{gallery.id}"
        assert_equal false, json['myGood']
      end

      test 'GET /api/v1/galleries/:id — 職人プロフィール未登録の投稿者でも 500 にならない' do
        plain_user = build_user('PlainGalUser')
        gallery = create_gallery(plain_user, comment: '職人未登録の作品')

        api_get "/api/v1/galleries/#{gallery.id}"
        assert_response :success
        assert_nil json['creator']
      end

      test 'GET /api/v1/galleries/:id — 存在しない id は 404' do
        api_get '/api/v1/galleries/no_such_gallery'
        assert_response :not_found
      end

      private

      def create_gallery(user, comment:, tag_list: nil)
        Gallery.create!(user_id: user.id, comment: comment, tag_list: tag_list, data: sample_image)
      end

      def sample_image
        Rack::Test::UploadedFile.new(Rails.root.join('test/fixtures/files/valid_image.png'),
                                     'image/png')
      end
    end
  end
end
