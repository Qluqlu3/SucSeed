require 'test_helper'

module Api
  module V1
    class ProfileCreatorsControllerTest < ApiTestCase
      VALID = { title: '新工房', art_category_id: nil, establishment: 10, employee: 2,
                postal_code: '1000001', is_recruitment: false }.freeze

      setup do
        @creator = build_creator('Crafter')
        @fresh = build_user('Fresh', is_creator: true) # 職人だが詳細プロフィール未登録
        @valid = VALID.merge(art_category_id: art_categories(:one).id)
      end

      test 'GET /api/v1/profile/creator — 自分の詳細プロフィールを返す' do
        api_login(@creator)

        api_get '/api/v1/profile/creator'
        assert_response :success
        assert_equal @creator.id, json['userId']
        assert_equal 'Crafter工房', json['title']
        assert_equal art_categories(:one).name, json['artCategoryName']
        assert_equal '1000001', json['postalCode']
        assert_equal true, json['isOwn']
      end

      test 'GET /api/v1/profile/creator — 未登録なら 404' do
        api_login(@fresh)

        api_get '/api/v1/profile/creator'
        assert_response :not_found
      end

      test 'POST /api/v1/profile/creator — 登録すると都道府県コードも入る' do
        api_login(@fresh)

        api_post '/api/v1/profile/creator', params: { creator: @valid }
        assert_response :created
        assert_equal '新工房', json['title']
        assert_equal false, json['isRecruitment']
        creator = Creator.find_by!(user_id: @fresh.id)
        assert_equal 13, creator.prefecture_code
        assert @fresh.reload.detail_profile_registered?
      end

      test 'POST /api/v1/profile/creator — 入力が不正なら 422 で理由を返す' do
        api_login(@fresh)

        api_post '/api/v1/profile/creator',
                 params: { creator: @valid.merge(title: '', postal_code: '12') }
        assert_response :unprocessable_content
        assert_equal 'unprocessable_entity', error_code
        assert_operator json['error']['details'].size, :>=, 2
        assert_not Creator.exists?(user_id: @fresh.id)
      end

      test 'POST /api/v1/profile/creator — 登録済みなら 409 で2行目を作らない' do
        api_login(@creator)

        assert_no_difference -> { Creator.where(user_id: @creator.id).count } do
          api_post '/api/v1/profile/creator', params: { creator: @valid }
        end
        assert_response :conflict
        assert_equal 'already_registered', error_code
      end

      test 'PATCH /api/v1/profile/creator — 更新する' do
        api_login(@creator)

        api_patch '/api/v1/profile/creator',
                  params: { creator: { title: '改名工房', is_recruitment: false } }
        assert_response :success
        assert_equal '改名工房', json['title']
        assert_equal false, Creator.find_by!(user_id: @creator.id).is_recruitment
      end

      test 'PATCH /api/v1/profile/creator — 不正なら 422、未登録なら 404' do
        api_login(@creator)
        api_patch '/api/v1/profile/creator', params: { creator: { establishment: 9999 } }
        assert_response :unprocessable_content

        api_login(@fresh)
        api_patch '/api/v1/profile/creator', params: { creator: { title: 'x' } }
        assert_response :not_found
      end

      test '後継者は使えず 403、未ログインは 401' do
        api_get '/api/v1/profile/creator'
        assert_response :unauthorized

        api_login(build_heir('Heir'))
        api_get '/api/v1/profile/creator'
        assert_response :forbidden
        api_post '/api/v1/profile/creator', params: { creator: @valid }
        assert_response :forbidden
      end
    end
  end
end
