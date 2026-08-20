require 'test_helper'

module Api
  module V1
    class FavoritesControllerTest < ApiTestCase
      setup do
        @heir = build_heir('FavHeir')
        @creator = build_creator('FavCreator')
      end

      test 'GET /api/v1/favorites — 未ログインは 401' do
        api_get '/api/v1/favorites'
        assert_response :unauthorized
        assert_equal 'unauthorized', error_code
      end

      test 'GET /api/v1/favorites — 自分がお気に入り登録した相手だけが返る' do
        other_heir = build_heir('OtherFavHeir')
        another_creator = build_creator('AnotherFavCreator')
        Favorite.create!(user_id: @heir.id, favorite_user_id: @creator.id)
        Favorite.create!(user_id: other_heir.id, favorite_user_id: another_creator.id)

        api_login(@heir)
        api_get '/api/v1/favorites'
        assert_response :success
        assert_equal [@creator.id], json['items'].pluck('id')
      end

      test 'POST /api/v1/favorites — お気に入り登録できる' do
        api_login(@heir)
        api_post '/api/v1/favorites', params: { id: @creator.id }
        assert_response :created
        assert_equal true, json['favorited']
        assert Favorite.exists?(user_id: @heir.id, favorite_user_id: @creator.id)
      end

      test 'POST /api/v1/favorites — 重複登録は 422 とエラー詳細' do
        Favorite.create!(user_id: @heir.id, favorite_user_id: @creator.id)

        api_login(@heir)
        api_post '/api/v1/favorites', params: { id: @creator.id }
        assert_response :unprocessable_content
        assert_equal 'unprocessable_entity', error_code
        assert json.dig('error', 'details').any?
      end

      test 'DELETE /api/v1/favorites/:id — 解除できる' do
        Favorite.create!(user_id: @heir.id, favorite_user_id: @creator.id)

        api_login(@heir)
        api_delete "/api/v1/favorites/#{@creator.id}"
        assert_response :success
        assert_equal false, json['favorited']
        assert_not Favorite.exists?(user_id: @heir.id, favorite_user_id: @creator.id)
      end

      test 'DELETE /api/v1/favorites/:id — 未登録でも 404 にせず冪等に成功する' do
        api_login(@heir)
        api_delete "/api/v1/favorites/#{@creator.id}"
        assert_response :success
        assert_equal false, json['favorited']
      end

      test 'DELETE /api/v1/favorites/:id — 他人のお気に入りは削除されない' do
        other_heir = build_heir('IntruderHeir')
        Favorite.create!(user_id: other_heir.id, favorite_user_id: @creator.id)

        api_login(@heir)
        api_delete "/api/v1/favorites/#{@creator.id}"
        assert_response :success
        assert Favorite.exists?(user_id: other_heir.id, favorite_user_id: @creator.id)
      end
    end
  end
end
