require 'test_helper'

class GalleryControllerTest < ActionDispatch::IntegrationTest
  setup do
    @alice = users(:alice)
    @bob = users(:creator_bob)
  end

  def create_user(name)
    User.create!(name: name, email: "#{name.downcase}@example.com", password: 'password123',
                 password_confirmation: 'password123', birthday: '1990-01-01', is_man: true)
  end

  # CarrierWaveの実ファイルアップロードはこのテストの関心外なので、
  # data列はwrite_attributeで直接書き込みバリデーションをスキップする。
  def create_gallery(user_id:, comment: 'テスト画像')
    gallery = Gallery.new(user_id: user_id, comment: comment)
    gallery.write_attribute(:data, "#{SecureRandom.hex(4)}.jpg")
    gallery.save!(validate: false)
    gallery
  end

  def galleries_props(body)
    JSON.parse(Nokogiri::HTML(body).at_css('[data-props]')['data-props'])['galleries']
  end

  test 'GET /gallery/favorite — 自分とお気に入り登録した相手のギャラリーだけが表示される' do
    mine = create_gallery(user_id: @alice.id, comment: '自分の画像')
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)
    favorited = create_gallery(user_id: @bob.id, comment: '相手の画像')
    stranger = create_user('Stranger2')
    create_gallery(user_id: stranger.id, comment: '関係ない人の画像')

    log_in_as(@alice)
    get '/gallery/favorite'
    assert_response :success

    ids = galleries_props(response.body).pluck('id')
    assert_equal [mine.id, favorited.id].sort, ids.sort
  end

  test 'GET /gallery/favorite — 自分がいいねしたギャラリーだけmyGood: trueになる(他人のいいねは数えない)' do
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)
    favorited_gallery = create_gallery(user_id: @bob.id, comment: '相手の画像')
    other_liker = create_user('OtherLiker2')
    GalleryGood.create!(user_id: other_liker.id, gallery_id: favorited_gallery.id)

    log_in_as(@alice)
    get '/gallery/favorite'
    assert_response :success

    gallery = galleries_props(response.body).find { |g| g['id'] == favorited_gallery.id }
    assert_equal false, gallery['myGood']

    GalleryGood.create!(user_id: @alice.id, gallery_id: favorited_gallery.id)
    get '/gallery/favorite'
    gallery = galleries_props(response.body).find { |g| g['id'] == favorited_gallery.id }
    assert_equal true, gallery['myGood']
  end

  test 'GET /gallery/my_gallery — 自分のギャラリーのみ表示される(お気に入り登録した相手の分は含まない)' do
    mine = create_gallery(user_id: @alice.id, comment: '自分の画像')
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)
    create_gallery(user_id: @bob.id, comment: '相手の画像')

    log_in_as(@alice)
    get '/gallery/my_gallery'
    assert_response :success

    ids = galleries_props(response.body).pluck('id')
    assert_equal [mine.id], ids
  end

  test 'GET /gallery/heir/favorite — 実際のgoodCount/myGoodが返る(以前はハードコードされたfalse/0だった)' do
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)
    favorited_gallery = create_gallery(user_id: @bob.id, comment: '相手の画像')
    GalleryGood.create!(user_id: @alice.id, gallery_id: favorited_gallery.id)

    log_in_as(@alice)
    get '/gallery/heir/favorite'
    assert_response :success

    gallery = galleries_props(response.body).find { |g| g['id'] == favorited_gallery.id }
    assert_equal 1, gallery['goodCount']
    assert_equal true, gallery['myGood']
  end
end
