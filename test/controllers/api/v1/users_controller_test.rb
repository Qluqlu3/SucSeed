require 'test_helper'

module Api
  module V1
    class UsersControllerTest < ApiTestCase
      test 'GET /api/v1/users/:id — 未ログインでも公開情報が取れる' do
        user = build_user('PublicUser')

        api_get "/api/v1/users/#{user.id}"
        assert_response :success
        assert_equal user.id, json['id']
        assert_equal 'PublicUser', json['name']
        assert_equal false, json['hasCreatorProfile']
      end

      test 'GET /api/v1/users/:id — メールアドレスなどの非公開項目は含めない' do
        user = build_user('Private')

        api_get "/api/v1/users/#{user.id}"
        assert_not json.key?('email')
        assert_not json.key?('passwordDigest')
      end

      test 'GET /api/v1/users/:id — 職人の詳細プロフィールがあれば hasCreatorProfile が true' do
        creator = build_creator('CreatorUser')

        api_get "/api/v1/users/#{creator.id}"
        assert_equal true, json['hasCreatorProfile']
      end

      test 'GET /api/v1/users/:id — 存在しない・退会したユーザーは 404' do
        api_get '/api/v1/users/nope'
        assert_response :not_found
        assert_equal 'not_found', error_code

        user = build_user('Left')
        user.soft_delete
        api_get "/api/v1/users/#{user.id}"
        assert_response :not_found
      end
    end
  end
end
