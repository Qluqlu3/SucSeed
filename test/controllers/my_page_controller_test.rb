require 'test_helper'

class MyPageControllerTest < ActionDispatch::IntegrationTest
  include UserFactory

  setup do
    @user = build_user('MyPageUser')
  end

  test 'PATCH /my_page/update — user パラメータが無くても 500 にせず 400 相当で弾く' do
    log_in_as(@user)

    patch '/my_page/update'

    assert_redirected_to '/index'
    assert_equal I18n.t('flash.danger.invalid_request'), flash[:danger]
  end

  def page_props
    JSON.parse(response.parsed_body.at_css('[data-props]')['data-props'])
  end

  test 'GET /my_page/my_page — 自分のプロフィールを表示する' do
    @user.update!(profile: '自己紹介')
    log_in_as(@user)

    get '/my_page/my_page'

    assert_response :success
    user = page_props['user']
    assert_equal ['MyPageUser', 'mypageuser@example.com', '1990-01-01'],
                 user.values_at('name', 'email', 'birthday')
    assert_equal [true, '自己紹介', default_avatar_path],
                 user.values_at('isMan', 'profile', 'avatarPath')
    assert_equal false, page_props['isCreator']
  end

  test 'GET /my_page/my_page — 職人/後継者の詳細プロフィールが未登録かどうかで登録導線を出し分ける' do
    log_in_as(@user)
    get '/my_page/my_page'
    assert_equal false, page_props['user']['detailRegistered']

    post '/user/logout'
    heir = build_heir('MyPageHeir')
    log_in_as(heir)
    get '/my_page/my_page'
    assert_equal true, page_props['user']['detailRegistered']
  end

  test 'GET /my_page/update — 編集フォームに現在の値を入れる' do
    log_in_as(@user)

    get '/my_page/update'

    assert_response :success
    assert_equal ['MyPageUser', 'mypageuser@example.com'],
                 page_props['user'].values_at('name', 'email')
    assert_equal [], page_props['errors']
  end

  test 'PATCH /my_page/update — 更新してマイページへ戻る' do
    log_in_as(@user)

    patch '/my_page/update', params: { user: { name: '新しい名前', profile: '更新後' } }

    assert_redirected_to '/my_page/my_page'
    assert_equal %w[新しい名前 更新後], @user.reload.values_at(:name, :profile)
  end

  test 'PATCH /my_page/update — 入力エラーならエラー付きで編集フォームを出し直す' do
    log_in_as(@user)

    patch '/my_page/update', params: { user: { name: '' } }

    assert_response :success
    assert_not_empty page_props['errors']
    assert_equal 'MyPageUser', @user.reload.name
  end
end
