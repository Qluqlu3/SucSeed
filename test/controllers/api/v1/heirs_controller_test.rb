require 'test_helper'

module Api
  module V1
    class HeirsControllerTest < ApiTestCase
      setup do
        @creator = build_creator('Crafter')
        @heir = build_heir('Heir')
      end

      test 'GET /api/v1/heirs/:id — 未ログインでも後継者の公開情報と分野が取れる' do
        @heir.heir.update!(introduction: '紹介')
        @heir.update!(profile: '後継者の紹介文')

        api_get "/api/v1/heirs/#{@heir.id}"
        assert_response :success
        assert_equal @heir.id, json['userId']
        assert_equal art_categories(:one).id, json['artCategoryId']
        assert_equal art_categories(:one).name, json['artCategoryName']
        assert_equal '紹介', json['introduction']
        assert_equal '後継者の紹介文', json['user']['profile']
        assert_not json['user'].key?('email')
        assert_equal false, json['isScouted']
        assert_equal false, json['isOwn']
      end

      test 'GET /api/v1/heirs/:id — 詳細プロフィール未登録の後継者も返し、分野は null' do
        plain = build_user('Plain')

        api_get "/api/v1/heirs/#{plain.id}"
        assert_response :success
        assert_equal 'Plain', json['user']['name']
        assert_nil json['artCategoryId']
        assert_nil json['artCategoryName']
        assert_nil json['introduction']
      end

      test 'GET /api/v1/heirs/:id — 職人・存在しない・退会したユーザーは 404' do
        api_get "/api/v1/heirs/#{@creator.id}"
        assert_response :not_found

        api_get '/api/v1/heirs/nope'
        assert_response :not_found

        @heir.soft_delete
        api_get "/api/v1/heirs/#{@heir.id}"
        assert_response :not_found
      end

      test 'GET /api/v1/heirs/:id — スカウト済みの職人が見ると isScouted が true' do
        Match.scout(creator_id: @creator.id, heir_id: @heir.id).save!
        log_in_as(@creator)

        api_get "/api/v1/heirs/#{@heir.id}"
        assert_equal true, json['isScouted']
      end

      # 2人の間の matches は一意なので、アピールを受けた相手にはスカウトを送れない
      test 'GET /api/v1/heirs/:id — 後継者からアピールされた職人が見ても isScouted が true' do
        Match.appeal(heir_id: @heir.id, creator_id: @creator.id).save!
        log_in_as(@creator)

        api_get "/api/v1/heirs/#{@heir.id}"
        assert_equal true, json['isScouted']
      end

      test 'GET /api/v1/heirs/:id — 本人が見ると isOwn が true' do
        log_in_as(@heir)

        api_get "/api/v1/heirs/#{@heir.id}"
        assert_equal true, json['isOwn']
      end
    end
  end
end
