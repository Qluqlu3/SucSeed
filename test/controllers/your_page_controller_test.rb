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
end
