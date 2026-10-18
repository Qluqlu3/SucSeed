require 'test_helper'

class CreatorControllerTest < ActionDispatch::IntegrationTest
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

  test 'GET /creator/show — 職人情報が未登録なら登録フォームを出す' do
    log_in_as(build_user('NoCreator', is_creator: true))

    get '/creator/show'

    assert_response :success
    assert_equal({ 'artCategories' => art_category_options, 'errors' => [] },
                 page_props.except('flash'))
  end

  test 'GET /creator/show — 登録済みなら自分の職人情報を出す' do
    log_in_as(build_creator('Shown', postal_code: '1500001'))

    get '/creator/show'

    assert_response :success
    assert_equal({
                   'creator' => {
                     'title' => 'Shown工房', 'categoryName' => @category.name, 'establishment' => 5,
                     'employee' => 3, 'postalCode' => '1500001', 'isRecruitment' => true
                   },
                   'isCreator' => true,
                 }, page_props.except('flash'))
  end

  test 'GET /creator/edit — 現在の登録内容をフォームの初期値として渡す' do
    log_in_as(build_creator('Editing', postal_code: '1500001'))

    get '/creator/edit'

    assert_response :success
    assert_equal({
                   'creator' => {
                     'title' => 'Editing工房', 'artCategoryId' => @category.id,
                     'categoryName' => @category.name, 'establishment' => 5, 'employee' => 3,
                     'postalCode' => '1500001', 'isRecruitment' => true
                   },
                   'artCategories' => art_category_options,
                   'isCreator' => true,
                   'errors' => [],
                 }, page_props.except('flash'))
  end

  test 'GET /creator/edit — 募集していない職人は isRecruitment が false' do
    log_in_as(build_creator('NotRecruiting', is_recruitment: false))

    get '/creator/edit'

    assert_equal false, page_props['creator']['isRecruitment']
  end

  test 'POST /creator/create — 入力エラーならエラー付きで登録フォームを出し直す' do
    log_in_as(build_user('Invalid', is_creator: true))

    post '/creator/create', params: { creator: { title: '', art_category_id: @category.id } }

    assert_response :success
    assert_equal art_category_options, page_props['artCategories']
    assert_not_empty page_props['errors']
  end
end
