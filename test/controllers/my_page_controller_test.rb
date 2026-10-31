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
end
