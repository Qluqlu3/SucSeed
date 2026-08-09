require 'test_helper'

class IndexControllerTest < ActionDispatch::IntegrationTest
  def create_user(name)
    User.create!(name: name, email: "#{name.downcase}@example.com", password: 'password123',
                 password_confirmation: 'password123', birthday: '1990-01-01', is_man: true)
  end

  # 都道府県コード13(東京)に対応する郵便番号
  def create_creator(user, art_category: art_categories(:one), postal_code: '1000001')
    Creator.create!(user_id: user.id, title: 'title', art_category_id: art_category.id,
                    establishment: 5, employee: 3, postal_code: postal_code, is_recruitment: true)
  end

  def page_props(body)
    JSON.parse(Nokogiri::HTML(body).at_css('[data-props]')['data-props'])
  end

  test 'GET /index — creatorsは1ページ12件で分割される' do
    15.times { |i| create_creator(create_user("Creator#{i}")) }

    get '/index'
    props = page_props(response.body)
    assert_equal 12, props['creators'].size
    assert_equal({ 'currentPage' => 1, 'totalPages' => 2, 'totalCount' => 15 }, props['pagination'])

    get '/index', params: { page: 2 }
    props = page_props(response.body)
    assert_equal 3, props['creators'].size
    assert_equal 2, props['pagination']['currentPage']
  end

  test 'GET /index — creatorCountByPrefectureは現在ページに関わらず全件を集計する' do
    15.times { |i| create_creator(create_user("Creator#{i}")) }

    get '/index'
    props = page_props(response.body)
    assert_equal 15, props['creatorCountByPrefecture']['13']
  end

  test 'GET /index — 範囲外のpageを指定すると最終ページへリダイレクトされる' do
    15.times { |i| create_creator(create_user("Creator#{i}")) }

    get '/index', params: { page: 999 }
    assert_redirected_to '/index?page=2'
  end

  test 'GET /search/user — art_category_idで絞り込みつつページネーションされる' do
    15.times { |i| create_creator(create_user("Creator#{i}"), art_category: art_categories(:one)) }
    create_creator(create_user('OtherCategoryCreator'), art_category: art_categories(:two))

    get '/search/user', params: { search: { art_category_id: art_categories(:one).id } }
    props = page_props(response.body)
    assert_equal 12, props['creators'].size
    assert_equal 15, props['pagination']['totalCount']
    assert_equal art_categories(:one).id, props['artCategoryId']

    get '/search/user', params: { search: { art_category_id: art_categories(:one).id }, page: 2 }
    props = page_props(response.body)
    assert_equal 3, props['creators'].size
  end

  test 'GET /search/user — search未指定は/indexへリダイレクト(NoMethodErrorにならない)' do
    get '/search/user'
    assert_redirected_to '/index'
  end

  test 'GET /search/user — art_category_id空文字は/indexへリダイレクト' do
    get '/search/user', params: { search: { art_category_id: '' } }
    assert_redirected_to '/index'
  end
end
