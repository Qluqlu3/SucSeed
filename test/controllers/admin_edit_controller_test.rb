require 'test_helper'

class AdminEditControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = admins(:alice_admin)
  end

  def log_in_as_admin(admin, password: 'adminpass1')
    post '/admin/login', params: { admin: { user_id: admin.user_id, password: password } }
  end

  def create_user(name)
    User.create!(name: name, email: "#{name.downcase}@example.com", password: 'password123',
                 password_confirmation: 'password123', birthday: '1990-01-01', is_man: true)
  end

  def page_props(body)
    JSON.parse(Nokogiri::HTML(body).at_css('[data-props]')['data-props'])
  end

  test 'GET /admin/management/user — 1ページ20件でページネーションされる' do
    log_in_as_admin(@admin)
    25.times { |i| create_user("AdminListUser#{i}") }
    total = User.with_deleted.count

    get '/admin/management/user'
    props = page_props(response.body)
    assert_equal 20, props['users'].size
    assert_equal({ 'currentPage' => 1, 'totalPages' => 2, 'totalCount' => total },
                 props['pagination'])

    get '/admin/management/user', params: { page: 2 }
    props = page_props(response.body)
    assert_equal total - 20, props['users'].size
  end

  test 'GET /admin/management/user — 範囲外のpageは最終ページへリダイレクトされる' do
    log_in_as_admin(@admin)
    get '/admin/management/user', params: { page: 999 }
    assert_response :redirect
    follow_redirect!
    assert_response :success
  end

  test 'GET /admin/management/diary — pagination情報付きで一覧が返る' do
    log_in_as_admin(@admin)
    user = create_user('DiaryOwner')
    22.times { |i| Diary.create!(user_id: user.id, content: "diary content #{i}") }
    total = Diary.with_deleted.count

    get '/admin/management/diary'
    props = page_props(response.body)
    assert_equal 20, props['diaries'].size
    assert_equal total, props['pagination']['totalCount']
  end

  test 'GET /admin/management/diary_comment — pagination情報付きで一覧が返る' do
    log_in_as_admin(@admin)
    user = create_user('CommentOwner')
    diary = Diary.create!(user_id: user.id, content: 'target diary')
    22.times do |i|
      DiaryComment.create!(user_id: user.id, diary_id: diary.id, comment: "comment #{i}")
    end
    total = DiaryComment.with_deleted.count

    get '/admin/management/diary_comment'
    props = page_props(response.body)
    assert_equal 20, props['comments'].size
    assert_equal total, props['pagination']['totalCount']
  end

  test 'GET /admin/management/gallery — pagination情報付きで一覧が返る' do
    log_in_as_admin(@admin)
    user = create_user('GalleryOwner')
    22.times do |i|
      gallery = Gallery.new(user_id: user.id, comment: "gallery comment #{i}")
      gallery.write_attribute(:data, "#{SecureRandom.hex(4)}.jpg")
      gallery.save!(validate: false)
    end
    total = Gallery.with_deleted.count

    get '/admin/management/gallery'
    props = page_props(response.body)
    assert_equal 20, props['galleries'].size
    assert_equal total, props['pagination']['totalCount']
  end

  test 'GET /admin/management/inquiry — pagination情報付きで一覧が返る' do
    log_in_as_admin(@admin)
    22.times do |i|
      Inquiry.create!(inquiry_category_id: inquiry_categories(:one).id, content: "inquiry #{i}")
    end
    # inquiry一覧はinquiry_categoryへのINNER JOINなので、カテゴリが紐付かない
    # (fixtureのinquiries.yml等の)行は集計対象に入らない。それに合わせて数える
    total = Inquiry.with_deleted.joins(:inquiry_category).count

    get '/admin/management/inquiry'
    props = page_props(response.body)
    assert_equal 20, props['inquiries'].size
    assert_equal total, props['pagination']['totalCount']
  end
end
