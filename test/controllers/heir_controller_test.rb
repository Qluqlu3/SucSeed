require 'test_helper'

class HeirControllerTest < ActionDispatch::IntegrationTest
  include UserFactory

  setup do
    @category = art_categories(:one)
  end

  def page_props
    JSON.parse(response.parsed_body.at_css('[data-props]')['data-props'])
  end

  # flash はログイン時の「ログイン成功」が残るので比較から外す

  def art_category_options
    ArtCategory.order(:id).map { |c| { 'id' => c.id, 'name' => c.name } }
  end

  test 'GET /heir/show — 後継者情報が未登録なら登録フォームを出す' do
    log_in_as(build_user('NoHeir'))

    get '/heir/show'

    assert_response :success
    assert_equal({ 'artCategories' => art_category_options, 'errors' => [] },
                 page_props.except('flash'))
  end

  test 'GET /heir/show — 登録済みなら興味のある分野と紹介文を出す' do
    heir = build_heir('Shown')
    Heir.find_by(user_id: heir.id).update!(introduction: 'よろしく')
    log_in_as(heir)

    get '/heir/show'

    assert_response :success
    assert_equal({ 'heir' => { 'artCategoryName' => @category.name, 'introduction' => 'よろしく' } },
                 page_props.except('flash'))
  end

  test 'GET /heir/edit — 現在の登録内容をフォームの初期値として渡す' do
    log_in_as(build_heir('Editing'))

    get '/heir/edit'

    assert_response :success
    assert_equal({
                   'heir' => { 'artCategoryId' => @category.id, 'introduction' => '' },
                   'artCategories' => art_category_options,
                   'errors' => [],
                 }, page_props.except('flash'))
  end

  test 'GET /heir/edit — 未登録なら登録画面へ戻す' do
    log_in_as(build_user('NoHeirEdit'))

    get '/heir/edit'

    assert_redirected_to '/heir/show'
  end
end
