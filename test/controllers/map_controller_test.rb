require 'test_helper'

class MapControllerTest < ActionDispatch::IntegrationTest
  def create_user(name)
    User.create!(name: name, email: "#{name.downcase}@example.com", password: 'password123',
                 password_confirmation: 'password123', birthday: '1990-01-01', is_man: true)
  end

  # 都道府県コード13(東京)に対応する郵便番号
  def create_creator(user, is_recruitment: true, postal_code: '1000001')
    Creator.create!(user_id: user.id, title: 'title', art_category_id: art_categories(:one).id,
                    establishment: 5, employee: 3, postal_code: postal_code,
                    is_recruitment: is_recruitment)
  end

  def page_props(body)
    JSON.parse(Nokogiri::HTML(body).at_css('[data-props]')['data-props'])
  end

  test 'GET /map — 募集中のcreatorのみ表示される' do
    recruiting = create_creator(create_user('Recruiting'))
    create_creator(create_user('NotRecruiting'), is_recruitment: false)

    get '/map'
    assert_response :success

    ids = page_props(response.body)['creators'].pluck('userId')
    assert_equal [recruiting.user_id], ids
  end

  test 'GET /map — creator状態でログイン中は自分自身を除外する' do
    # is_creator: true の fixture user でないと session[:creator] がセットされない
    create_creator(users(:creator_bob))
    other = create_creator(create_user('Other'))

    log_in_as(users(:creator_bob))
    get '/map'

    ids = page_props(response.body)['creators'].pluck('userId')
    assert_equal [other.user_id], ids
  end

  test 'GET /map — 未ログインでは全ての募集中creatorが表示される(自分がいないため除外なし)' do
    a = create_creator(create_user('A'))
    b = create_creator(create_user('B'))

    get '/map'

    ids = page_props(response.body)['creators'].pluck('userId').sort
    assert_equal [a.user_id, b.user_id].sort, ids
  end

  test 'GET /map — traditionalCraftsキーが存在する' do
    get '/map'
    assert_response :success
    assert page_props(response.body).key?('traditionalCrafts')
  end
end
