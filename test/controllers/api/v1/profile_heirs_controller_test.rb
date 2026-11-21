require 'test_helper'

module Api
  module V1
    class ProfileHeirsControllerTest < ApiTestCase
      setup do
        @heir = build_heir('Heir')
        @fresh = build_user('Fresh') # 後継者だが詳細プロフィール未登録
      end

      test 'GET /api/v1/profile/heir — 自分の詳細プロフィールを返す' do
        @heir.heir.update!(introduction: 'よろしく')
        api_login(@heir)

        api_get '/api/v1/profile/heir'
        assert_response :success
        assert_equal art_categories(:one).name, json['artCategoryName']
        assert_equal 'よろしく', json['introduction']
        assert_equal true, json['isOwn']
      end

      test 'GET /api/v1/profile/heir — 未登録なら 404' do
        api_login(@fresh)

        api_get '/api/v1/profile/heir'
        assert_response :not_found
      end

      test 'POST /api/v1/profile/heir — 登録するとロールが heir になる' do
        api_login(@fresh)
        assert_equal 'user', @fresh.role

        api_post '/api/v1/profile/heir',
                 params: { heir: { art_category_id: art_categories(:two).id,
                                   introduction: 'はじめまして' } }
        assert_response :created
        assert_equal art_categories(:two).id, json['artCategoryId']
        assert_equal 'はじめまして', json['introduction']
        assert_equal 'heir', @fresh.reload.role
      end

      test 'POST /api/v1/profile/heir — 分野が無ければ 422、登録済みなら 409' do
        api_login(@fresh)
        api_post '/api/v1/profile/heir',
                 params: { heir: { art_category_id: '', introduction: 'x' } }
        assert_response :unprocessable_content
        assert_not Heir.exists?(user_id: @fresh.id)

        api_login(@heir)
        assert_no_difference -> { Heir.where(user_id: @heir.id).count } do
          api_post '/api/v1/profile/heir',
                   params: { heir: { art_category_id: art_categories(:one).id } }
        end
        assert_response :conflict
        assert_equal 'already_registered', error_code
      end

      test 'PATCH /api/v1/profile/heir — 更新する。未登録なら 404' do
        api_login(@heir)
        api_patch '/api/v1/profile/heir', params: { heir: { introduction: '更新しました' } }
        assert_response :success
        assert_equal '更新しました', @heir.heir.reload.introduction

        api_login(@fresh)
        api_patch '/api/v1/profile/heir', params: { heir: { introduction: 'x' } }
        assert_response :not_found
      end

      test '職人は使えず 403、未ログインは 401' do
        api_get '/api/v1/profile/heir'
        assert_response :unauthorized

        api_login(build_creator('Crafter'))
        api_get '/api/v1/profile/heir'
        assert_response :forbidden
        api_post '/api/v1/profile/heir',
                 params: { heir: { art_category_id: art_categories(:one).id } }
        assert_response :forbidden
      end
    end
  end
end
