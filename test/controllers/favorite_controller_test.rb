require 'test_helper'

class FavoriteControllerTest < ActionDispatch::IntegrationTest
  setup do
    @alice = users(:alice)
    @bob = users(:creator_bob)
  end

  test 'POST /favorite/:id/add — 初回登録は成功しcreator show へリダイレクトされる' do
    log_in_as(@alice)
    post "/favorite/#{@bob.id}/add"

    assert_redirected_to "/page/creator/#{@bob.id}"
    assert_equal 1, Favorite.where(user_id: @alice.id, favorite_user_id: @bob.id).count
  end

  test 'POST /favorite/:id/add — 既に登録済みの相手への再登録は失敗する(ユニーク制約)' do
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)

    log_in_as(@alice)
    post "/favorite/#{@bob.id}/add"

    assert_redirected_to "/page/creator/#{@bob.id}"
    assert_equal 1, Favorite.where(user_id: @alice.id, favorite_user_id: @bob.id).count
  end

  test 'POST /favorite/:id/delete — 登録済みのお気に入りを削除できる' do
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)

    log_in_as(@alice)
    post "/favorite/#{@bob.id}/delete"

    assert_redirected_to "/page/creator/#{@bob.id}"
    assert_equal 0, Favorite.where(user_id: @alice.id, favorite_user_id: @bob.id).count
  end

  test 'POST /favorite/:id/delete — 未ログインではrequire_loginにより処理されない' do
    post "/favorite/#{@bob.id}/delete"
    assert_redirected_to '/index'
  end
end
