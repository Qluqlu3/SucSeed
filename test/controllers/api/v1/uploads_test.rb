require 'test_helper'

module Api
  module V1
    # 画像を伴うエンドポイント（作品投稿 / アバター更新）。
    # CarrierWave が UploadedFile しか受け取れないため multipart/form-data で送る。
    class UploadsTest < ApiTestCase
      setup do
        @creator = build_creator('UploadCreator')
        @heir = build_heir('UploadHeir')
      end

      # ── 作品投稿 ──────────────────────────────────────────────────

      test 'POST /api/v1/galleries — 職人が作品を投稿できる' do
        api_login(@creator)
        assert_difference 'Gallery.count', 1 do
          api_post_multipart '/api/v1/galleries',
                             params: { gallery: { data: upload_fixture, comment: '新作です',
                                                  tag_list: '漆器' } }
        end
        assert_response :created
        assert json['dataUrl'].present?
        assert_equal ['漆器'], json['tags']
        assert_equal 0, json['goodCount']
        assert_equal false, json['myGood']
      end

      test 'POST /api/v1/galleries — 投稿した作品は一覧から取得できる' do
        api_login(@creator)
        api_post_multipart '/api/v1/galleries',
                           params: { gallery: { data: upload_fixture, comment: '新作です' } }
        created_id = json['id']

        api_get '/api/v1/galleries', params: { user_id: @creator.id }
        assert_includes json['items'].pluck('id'), created_id
      end

      test 'POST /api/v1/galleries — 後継者は投稿できず 403' do
        api_login(@heir)
        api_post_multipart '/api/v1/galleries',
                           params: { gallery: { data: upload_fixture, comment: 'x' } }
        assert_response :forbidden
      end

      test 'POST /api/v1/galleries — 未ログインは 401' do
        api_post_multipart '/api/v1/galleries',
                           params: { gallery: { data: upload_fixture, comment: 'x' } }
        assert_response :unauthorized
      end

      test 'POST /api/v1/galleries — comment が空なら 422' do
        api_login(@creator)
        assert_no_difference 'Gallery.count' do
          api_post_multipart '/api/v1/galleries',
                             params: { gallery: { data: upload_fixture, comment: '' } }
        end
        assert_response :unprocessable_content
        assert json.dig('error', 'details').any?
      end

      test 'POST /api/v1/galleries — 拡張子を偽装した画像は 422' do
        api_login(@creator)
        fake = upload_fixture('fake_image.jpg', 'image/jpeg')
        assert_no_difference 'Gallery.count' do
          api_post_multipart '/api/v1/galleries',
                             params: { gallery: { data: fake, comment: '偽装' } }
        end
        assert_response :unprocessable_content
      end

      test 'POST /api/v1/galleries — JSON でファイル名の文字列を渡すと 400' do
        api_login(@creator)
        api_post '/api/v1/galleries', params: { gallery: { data: 'photo.png', comment: 'x' } }
        assert_response :bad_request
        assert_equal 'not_multipart', error_code
      end

      test 'POST /api/v1/galleries — data 無しは 400' do
        api_login(@creator)
        api_post '/api/v1/galleries', params: { gallery: { comment: 'x' } }
        assert_response :bad_request
        assert_equal 'not_multipart', error_code
      end

      # ── アバター更新 ──────────────────────────────────────────────

      test 'PATCH /api/v1/profile — multipart でアバターを更新できる' do
        api_login(@heir)
        api_patch_multipart '/api/v1/profile', params: { user: { avatar_path: upload_fixture } }
        assert_response :success
        assert json['avatarPath'].present?
        assert_not_equal '/assets/default.png', json['avatarPath']
      end

      test 'PATCH /api/v1/profile — 画像と一緒に名前も更新できる' do
        api_login(@heir)
        api_patch_multipart '/api/v1/profile',
                            params: { user: { name: '新しい名前', avatar_path: upload_fixture } }
        assert_response :success
        assert_equal '新しい名前', json['name']
        assert_equal '新しい名前', @heir.reload.name
      end

      test 'PATCH /api/v1/profile — JSON で avatar_path に文字列を渡すと 500 ではなく 400' do
        api_login(@heir)
        api_patch '/api/v1/profile', params: { user: { avatar_path: 'evil.png' } }
        assert_response :bad_request
        assert_equal 'not_multipart', error_code
      end

      test 'PATCH /api/v1/profile — 拡張子を偽装した画像は 422' do
        api_login(@heir)
        api_patch_multipart '/api/v1/profile',
                            params: { user: { avatar_path: upload_fixture('fake_image.jpg',
                                                                          'image/jpeg') } }
        assert_response :unprocessable_content
      end

      test 'PATCH /api/v1/profile — avatar_path 無しの JSON 更新は従来どおり動く' do
        api_login(@heir)
        api_patch '/api/v1/profile', params: { user: { profile: 'よろしく' } }
        assert_response :success
        assert_equal 'よろしく', @heir.reload.profile
      end
    end
  end
end
