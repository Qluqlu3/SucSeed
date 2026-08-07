require 'test_helper'

class DiaryControllerTest < ActionDispatch::IntegrationTest
  setup do
    @alice = users(:alice)
    @bob = users(:creator_bob)
  end

  def create_user(name)
    User.create!(name: name, email: "#{name.downcase}@example.com", password: 'password123',
                 password_confirmation: 'password123', birthday: '1990-01-01', is_man: true)
  end

  def diaries_props(body)
    JSON.parse(Nokogiri::HTML(body).at_css('[data-props]')['data-props'])['diaries']
  end

  test 'GET /diary/view — 自分の日記とお気に入り登録した相手の日記だけが表示される' do
    mine = Diary.create!(user_id: @alice.id, content: '自分の日記')
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)
    favorited = Diary.create!(user_id: @bob.id, content: '相手の日記')
    stranger = create_user('Stranger1')
    Diary.create!(user_id: stranger.id, content: '関係ない人の日記')

    log_in_as(@alice)
    get '/diary/view'
    assert_response :success

    ids = diaries_props(response.body).pluck('diaryId')
    assert_equal [mine.id, favorited.id].sort, ids.sort
  end

  test 'GET /diary/view — 自分がいいねした日記だけmyGood: trueになる(お気に入り経由でも他人のいいねは数えない)' do
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)
    favorited_diary = Diary.create!(user_id: @bob.id, content: '相手の日記')
    other_liker = create_user('OtherLiker1')
    DiaryGood.create!(user_id: other_liker.id, diary_id: favorited_diary.id)

    log_in_as(@alice)
    get '/diary/view'
    assert_response :success

    diary = diaries_props(response.body).find { |d| d['diaryId'] == favorited_diary.id }
    assert_equal false, diary['myGood']

    DiaryGood.create!(user_id: @alice.id, diary_id: favorited_diary.id)
    get '/diary/view'
    diary = diaries_props(response.body).find { |d| d['diaryId'] == favorited_diary.id }
    assert_equal true, diary['myGood']
  end

  test 'GET /diary/my_diary — 自分の日記のみ表示される(お気に入り登録した相手の日記は含まない)' do
    mine = Diary.create!(user_id: @alice.id, content: '自分の日記')
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)
    Diary.create!(user_id: @bob.id, content: '相手の日記')

    log_in_as(@alice)
    get '/diary/my_diary'
    assert_response :success

    ids = diaries_props(response.body).pluck('diaryId')
    assert_equal [mine.id], ids
  end

  test 'GET /diary/show/:id — 指定したユーザーの日記のみ表示される' do
    target_diary = Diary.create!(user_id: @bob.id, content: '相手の日記')
    Diary.create!(user_id: @alice.id, content: '自分の日記')

    log_in_as(@alice)
    get "/diary/show/#{@bob.id}"
    assert_response :success

    ids = diaries_props(response.body).pluck('diaryId')
    assert_equal [target_diary.id], ids
  end

  test 'GET /diary/heir/favorite — select_diaryと同じ絞り込みで表示される' do
    mine = Diary.create!(user_id: @alice.id, content: '自分の日記')
    Favorite.create!(user_id: @alice.id, favorite_user_id: @bob.id)
    favorited = Diary.create!(user_id: @bob.id, content: '相手の日記')

    log_in_as(@alice)
    get '/diary/heir/favorite'
    assert_response :success

    ids = diaries_props(response.body).pluck('diaryId')
    assert_equal [mine.id, favorited.id].sort, ids.sort
  end
end
