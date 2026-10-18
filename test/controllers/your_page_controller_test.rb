require 'test_helper'

class YourPageControllerTest < ActionDispatch::IntegrationTest
  include UserFactory

  setup do
    @creator = build_creator('Crafter')
    @heir = build_heir('Heir')
  end

  def page_props
    JSON.parse(response.parsed_body.at_css('[data-props]')['data-props'])
  end

  # スカウトも matches に「user_id = 後継者 / target_user_id = 職人」の向きで入る
  test 'GET /page/heir/:id — スカウト済みの職人が見ると isScouted が true' do
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)
    log_in_as(@creator)

    get "/page/heir/#{@heir.id}"

    assert_response :success
    assert page_props['isScouted']
  end

  test 'GET /page/heir/:id — まだスカウトしていなければ isScouted が false' do
    log_in_as(@creator)

    get "/page/heir/#{@heir.id}"

    assert_response :success
    assert_not page_props['isScouted']
  end

  test 'GET /page/creator/:id — アピール済みの後継者が見ると isMatched が true' do
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)
    log_in_as(@heir)

    get "/page/creator/#{@creator.id}"

    assert_response :success
    assert page_props['isMatched']
  end

  test 'GET /page/creator/:id — 職人のプロフィールと閲覧者との関係を返す' do
    @creator.update!(profile: '職人の紹介文')
    log_in_as(@heir)

    get "/page/creator/#{@creator.id}"

    assert_response :success
    assert_equal({
                   'user' => {
                     'id' => @creator.id, 'name' => 'Crafter', 'isMan' => true,
                     'birthday' => '1990-01-01', 'avatarPath' => @creator.avatar_path.to_s
                   },
                   'creator' => {
                     'title' => 'Crafter工房', 'establishment' => 5, 'employee' => 3,
                     'profile' => '職人の紹介文', 'isRecruitment' => true
                   },
                   'artCategoryName' => art_categories(:one).name,
                   'isFavorited' => false,
                   'loggedIn' => true,
                   'isOwnPage' => false,
                   'isCreator' => false,
                   'isMatched' => false,
                   'targetUserId' => @creator.id,
                 }, page_props.except('flash'))
  end

  test 'GET /page/creator/:id — 職人情報の無いユーザーならトップへ戻す' do
    get "/page/creator/#{@heir.id}"

    assert_redirected_to '/index'
  end

  test 'GET /page/heir/:id — 後継者のプロフィールを返す' do
    @heir.update!(profile: '後継者の紹介文')

    get "/page/heir/#{@heir.id}"

    assert_response :success
    assert_equal({
                   'user' => {
                     'id' => @heir.id, 'name' => 'Heir', 'avatarPath' => @heir.avatar_path.to_s,
                     'isMan' => true, 'birthday' => '1990-01-01', 'profile' => '後継者の紹介文'
                   },
                   'artName' => art_categories(:one).name,
                   'isScouted' => false,
                   'loggedIn' => false,
                   'isCreator' => false,
                   'targetUserId' => @heir.id,
                 }, page_props.except('flash'))
  end
end
