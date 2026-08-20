require 'test_helper'

module Api
  module V1
    class ProfileControllerTest < ApiTestCase
      setup do
        @user = users(:alice)
      end

      test 'GET /api/v1/profile — 未ログインは 401' do
        api_get '/api/v1/profile'
        assert_response :unauthorized
      end

      test 'GET /api/v1/profile — 自分のプロフィールが返る' do
        api_login(@user)
        api_get '/api/v1/profile'
        assert_response :success
        assert_equal @user.id,    json['id']
        assert_equal @user.name,  json['name']
        assert_equal @user.email, json['email']
        assert_equal 'user',      json['role']
      end

      test 'GET /api/v1/profile — 詳細プロフィール未登録なら detailRegistered が false' do
        api_login(@user)
        api_get '/api/v1/profile'
        assert_equal false, json['detailRegistered']
      end

      test 'GET /api/v1/profile — 後継者情報を登録済みなら detailRegistered が true' do
        heir = build_heir('ProfHeir')

        api_login(heir)
        api_get '/api/v1/profile'
        assert_equal true, json['detailRegistered']
        assert_equal 'heir', json['role']
      end

      test 'GET /api/v1/profile — 職人情報を登録済みなら detailRegistered が true' do
        creator = build_creator('ProfCreator')

        api_login(creator)
        api_get '/api/v1/profile'
        assert_equal true, json['detailRegistered']
        assert_equal 'creator', json['role']
      end

      test 'PATCH /api/v1/profile — 名前と自己紹介を更新できる' do
        api_login(@user)
        api_patch '/api/v1/profile', params: { user: { name: '新しい名前', profile: 'よろしく' } }
        assert_response :success
        assert_equal '新しい名前', json['name']
        assert_equal '新しい名前', @user.reload.name
        assert_equal 'よろしく', @user.profile
      end

      test 'PATCH /api/v1/profile — 不正なメールアドレスは 422' do
        api_login(@user)
        api_patch '/api/v1/profile', params: { user: { email: 'not-an-email' } }
        assert_response :unprocessable_content
        assert json.dig('error', 'details').any?
        assert_equal 'alice@example.com', @user.reload.email
      end

      test 'PATCH /api/v1/profile — 名前が空なら 422' do
        api_login(@user)
        api_patch '/api/v1/profile', params: { user: { name: '' } }
        assert_response :unprocessable_content
      end

      test 'PATCH /api/v1/profile — is_creator など権限に関わる項目は更新できない' do
        api_login(@user)
        api_patch '/api/v1/profile', params: { user: { name: 'ok', is_creator: true } }
        assert_response :success
        assert_equal false, @user.reload.is_creator
      end

      test 'PATCH /api/v1/profile — user パラメータ欠落は 400' do
        api_login(@user)
        api_patch '/api/v1/profile', params: {}
        assert_response :bad_request
      end
    end
  end
end
