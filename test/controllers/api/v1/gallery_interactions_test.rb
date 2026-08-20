require 'test_helper'

module Api
  module V1
    # ギャラリーへのいいね / コメント（GalleryGoodsController・GalleryCommentsController）
    class GalleryInteractionsTest < ApiTestCase
      setup do
        @creator = build_creator('GalIntCreator')
        @heir = build_heir('GalIntHeir')
        image = Rack::Test::UploadedFile.new(Rails.root.join('test/fixtures/files/valid_image.png'),
                                             'image/png')
        @gallery = Gallery.create!(user_id: @creator.id, comment: '作品', data: image)
      end

      test 'POST /galleries/:id/good — いいねできる' do
        api_login(@heir)
        api_post "/api/v1/galleries/#{@gallery.id}/good"
        assert_response :created
        assert_equal 1, json['goodCount']
        assert_equal true, json['myGood']
      end

      test 'POST /galleries/:id/good — 二重いいねは 200 で現在の状態を返す' do
        GalleryGood.create!(gallery_id: @gallery.id, user_id: @heir.id)

        api_login(@heir)
        api_post "/api/v1/galleries/#{@gallery.id}/good"
        assert_response :ok
        assert_equal 1, GalleryGood.where(gallery_id: @gallery.id).count
      end

      test 'DELETE /galleries/:id/good — いいねを取り消せる' do
        GalleryGood.create!(gallery_id: @gallery.id, user_id: @heir.id)

        api_login(@heir)
        api_delete "/api/v1/galleries/#{@gallery.id}/good"
        assert_response :success
        assert_equal 0, json['goodCount']
        assert_equal false, json['myGood']
      end

      test 'POST /galleries/:id/good — 未ログインは 401' do
        api_post "/api/v1/galleries/#{@gallery.id}/good"
        assert_response :unauthorized
      end

      test 'POST /galleries/:id/comments — コメントできる' do
        api_login(@heir)
        api_post "/api/v1/galleries/#{@gallery.id}/comments",
                 params: { gallery_comment: { comment: '美しい' } }
        assert_response :created
        assert_equal '美しい', json.dig('comment', 'comment')
        assert_equal 'GalIntHeir', json.dig('comment', 'name')
        assert_equal 1, json['commentCount']
      end

      test 'POST /galleries/:id/comments — 空コメントは 422' do
        api_login(@heir)
        api_post "/api/v1/galleries/#{@gallery.id}/comments",
                 params: { gallery_comment: { comment: '' } }
        assert_response :unprocessable_content
      end

      test 'POST /galleries/:id/comments — 存在しないギャラリーは 404' do
        api_login(@heir)
        api_post '/api/v1/galleries/no_such/comments',
                 params: { gallery_comment: { comment: 'x' } }
        assert_response :not_found
      end
    end
  end
end
