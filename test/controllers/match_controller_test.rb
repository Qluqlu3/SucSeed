require 'test_helper'

# matches は「user_id = 後継者 / target_user_id = 職人」で向きが固定されており、
# アピール（後継者発）とスカウト（職人発）の区別は is_scout だけで付く。
# そのため絞り込みの条件を1つ落とすだけで、他人のマッチや逆向きのマッチが混ざる。
class MatchControllerTest < ActionDispatch::IntegrationTest
  include UserFactory

  setup do
    @creator = build_creator('Crafter')
    @heir = build_heir('Heir')
  end

  def page_props
    JSON.parse(response.parsed_body.at_css('[data-props]')['data-props'])
  end

  # マッチング一覧の [相手の id, 相手のプロフィールへのリンク]
  def matching_rows
    page_props['matches'].map { |m| [m['pageId'], m['profilePath']] }
  end

  # ── 回答（OK / ごめんなさい）─────────────────────────────────────────

  test 'POST /match/ok/:id — 職人は自分宛てのアピールを承認できる' do
    appeal = Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)
    log_in_as(@creator)

    post "/match/ok/#{@heir.id}"

    assert_redirected_to '/match/appealed/list'
    assert appeal.reload.is_ok
  end

  test 'POST /match/sorry/:id — 職人がアピールを断ると is_ok が false になる' do
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)
    log_in_as(@creator)

    post "/match/sorry/#{@heir.id}"

    assert_redirected_to '/match/appealed/list'
    assert_equal false, Match.find_by(user_id: @heir.id, target_user_id: @creator.id).is_ok
  end

  test 'POST /scout/sorry/:id — 後継者がスカウトを断ると is_ok が false になる' do
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)
    log_in_as(@heir)

    post "/scout/sorry/#{@creator.id}"

    assert_redirected_to '/match/scouted/list'
    assert_equal false, Match.find_by(user_id: @heir.id, target_user_id: @creator.id).is_ok
  end

  test 'POST /match/ok/:id — 存在しないアピールへの回答は失敗扱い' do
    log_in_as(@creator)

    post "/match/ok/#{@heir.id}"

    assert_redirected_to '/match/appealed/list'
    assert_equal I18n.t('flash.danger.error'), flash[:danger]
  end

  test 'POST /match/ok/:id — 職人は自分が送ったスカウトを承認できない' do
    scout = Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)
    log_in_as(@creator)

    post "/match/ok/#{@heir.id}"

    assert_nil scout.reload.is_ok
    follow_redirect!
    assert_equal I18n.t('flash.danger.error'), flash[:danger]
  end

  test 'POST /scout/ok/:id — 後継者は自分宛てのスカウトを承認できる' do
    scout = Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)
    log_in_as(@heir)

    post "/scout/ok/#{@creator.id}"

    assert_redirected_to '/match/scouted/list'
    assert scout.reload.is_ok
  end

  test 'POST /scout/ok/:id — 後継者は自分が送ったアピールを承認できない' do
    appeal = Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)
    log_in_as(@heir)

    post "/scout/ok/#{@creator.id}"

    assert_nil appeal.reload.is_ok
  end

  # ── 一覧 ─────────────────────────────────────────────────────────────

  test 'GET /match/appealed/list — 自分宛てで未回答のアピールだけが並ぶ' do
    other_creator = build_creator('OtherCrafter')
    answered_heir = build_heir('AnsweredHeir')
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)
    # 同じ後継者から他の職人へのアピール（旧実装はこれを自分宛てとして拾っていた）
    Match.create!(user_id: answered_heir.id, target_user_id: other_creator.id, is_scout: false)
    Match.create!(user_id: answered_heir.id, target_user_id: @creator.id, is_scout: false,
                  is_ok: false)
    # 自分が送ったスカウトはアピールではない
    scouted_heir = build_heir('ScoutedHeir')
    Match.create!(user_id: scouted_heir.id, target_user_id: @creator.id, is_scout: true)
    log_in_as(@creator)

    get '/match/appealed/list'

    assert_response :success
    matches = page_props['matches']
    assert_equal [@heir.id], matches.pluck('pageId')
    assert_equal default_avatar_path, matches.first['avatarPath']
  end

  test 'GET /match/scouted/list — 他の後継者宛てのスカウトが混ざらない' do
    other_heir = build_heir('OtherHeir')
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)
    Match.create!(user_id: other_heir.id, target_user_id: @creator.id, is_scout: true)
    log_in_as(@heir)

    get '/match/scouted/list'

    assert_response :success
    scouts = page_props['scouts']
    assert_equal [@creator.id], scouts.pluck('pageId')
    assert_equal 'Crafter工房', scouts.first['title']
    assert_equal default_avatar_path, scouts.first['avatarPath']
  end

  test 'GET /match/scout/list_check — 職人は送ったスカウトを回答状況付きで見られる' do
    declined_heir = build_heir('DeclinedHeir')
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true)
    Match.create!(user_id: declined_heir.id, target_user_id: @creator.id, is_scout: true,
                  is_ok: false)
    log_in_as(@creator)

    get '/match/scout/list_check'

    assert_response :success
    statuses = page_props['scouts'].to_h { |s| [s['pageId'], s['isOk']] }
    assert_equal({ @heir.id => nil, declined_heir.id => false }, statuses)
  end

  test 'GET /match/appeal/list_check — 後継者の未回答アピールにスカウトは混ざらない' do
    scouting_creator = build_creator('ScoutingCrafter')
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false)
    Match.create!(user_id: @heir.id, target_user_id: scouting_creator.id, is_scout: true)
    log_in_as(@heir)

    get '/match/appeal/list_check'

    assert_response :success
    assert_equal [@creator.id], page_props['appeals'].pluck('pageId')
  end

  test 'GET /match/matching/list — 職人・後継者のどちらからも成立したマッチが見える' do
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false, is_ok: true)
    pending_heir = build_heir('PendingHeir')
    Match.create!(user_id: pending_heir.id, target_user_id: @creator.id, is_scout: false)

    log_in_as(@creator)
    get '/match/matching/list'
    assert_response :success
    assert_equal [[@heir.id, "/page/heir/#{@heir.id}"]], matching_rows

    post '/user/logout'
    log_in_as(@heir)
    get '/match/matching/list'
    assert_response :success
    assert_equal [[@creator.id, "/page/creator/#{@creator.id}"]], matching_rows
  end

  test 'GET /match/matching/list — メッセージ一覧に追加済みかを boolean で返す' do
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false, is_ok: true,
                  is_add_list: true)
    other_heir = build_heir('NotAddedHeir')
    Match.create!(user_id: other_heir.id, target_user_id: @creator.id, is_scout: false, is_ok: true)
    log_in_as(@creator)

    get '/match/matching/list'

    flags = page_props['matches'].to_h { |m| [m['pageId'], m['isAddList']] }
    assert_equal({ @heir.id => true, other_heir.id => false }, flags)
  end

  test 'GET /match/matching/list — 退会済みの相手は一覧に出ない' do
    Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: false, is_ok: true)
    @heir.soft_delete
    log_in_as(@creator)

    get '/match/matching/list'

    assert_response :success
    assert_empty page_props['matches']
  end
end
