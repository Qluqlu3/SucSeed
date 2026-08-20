require 'test_helper'

module Api
  module V1
    # マスタデータ系（ArtCategoriesController / TraditionalCraftsController）と
    # API 全体の共通挙動（未定義パス・エラー形式）
    class MasterDataControllersTest < ApiTestCase
      test 'GET /api/v1/art_categories — 未ログインでも一覧が取れる' do
        api_get '/api/v1/art_categories'
        assert_response :success
        assert_equal ArtCategory.count, json['items'].size
        assert json['items'].first.key?('id')
        assert json['items'].first.key?('name')
      end

      test 'GET /api/v1/traditional_crafts — 一覧が取れる' do
        craft = TraditionalCraft.create!(
          name: '越前漆器', prefecture_code: 18, summary: '福井の伝統工芸',
          features: "軽い\n丈夫", art_category_id: art_categories(:one).id
        )

        api_get '/api/v1/traditional_crafts'
        assert_response :success
        item = json['items'].find { |c| c['id'] == craft.id }
        assert_equal '越前漆器', item['name']
        assert_equal %w[軽い 丈夫], item['features']
        assert_equal art_categories(:one).name, item['categoryName']
      end

      test 'GET /api/v1/traditional_crafts — 同分野・同都道府県の職人数が付く' do
        craft = TraditionalCraft.create!(
          name: '江戸切子', prefecture_code: 13, summary: '東京の伝統工芸',
          features: '透明', art_category_id: art_categories(:one).id
        )
        # postal_code 1000001 は prefecture_code 13(東京)
        build_creator('CraftCreator', art_category: art_categories(:one), postal_code: '1000001')

        api_get '/api/v1/traditional_crafts'
        item = json['items'].find { |c| c['id'] == craft.id }
        assert_equal 1, item['relatedCreatorsCount']
      end

      # ── API 共通の挙動 ────────────────────────────────────────────

      test '/api/v1 の未定義パスは HTML ではなく JSON の 404 を返す' do
        api_get '/api/v1/no_such_endpoint'
        assert_response :not_found
        assert_equal 'application/json', response.media_type
        assert_equal 'not_found', error_code
      end

      test 'エラーレスポンスは常に error.code / error.message / error.details を持つ' do
        api_get '/api/v1/favorites'
        assert_response :unauthorized
        error = json['error']
        assert error.key?('code')
        assert error.key?('message')
        assert error.key?('details')
      end
    end
  end
end
