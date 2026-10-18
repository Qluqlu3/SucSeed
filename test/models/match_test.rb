require 'test_helper'

# matches は「user_id = 後継者 / target_user_id = 職人」で向きが固定されている。
# 呼び出し側が向きを意識せずに済むよう、Match のメソッドがこの対応を引き受ける。
class MatchTest < ActiveSupport::TestCase
  include UserFactory

  setup do
    @creator = build_creator('ModelCreator')
    @heir = build_heir('ModelHeir')
  end

  test 'appeal も scout も後継者 → 職人の向きで作られ、is_scout だけが違う' do
    appeal = Match.appeal(heir_id: @heir.id, creator_id: @creator.id)
    scout = Match.scout(creator_id: @creator.id, heir_id: @heir.id)

    assert_equal [@heir.id, @creator.id, false],
                 [appeal.user_id, appeal.target_user_id, appeal.is_scout]
    assert_equal [@heir.id, @creator.id, true],
                 [scout.user_id, scout.target_user_id, scout.is_scout]
  end

  test 'involving は職人なら target_user_id、後継者なら user_id で自分の行を選ぶ' do
    match = Match.appeal(heir_id: @heir.id, creator_id: @creator.id).tap(&:save!)
    other = build_heir('OtherHeir')
    Match.appeal(heir_id: other.id, creator_id: build_creator('OtherCreator').id).save!

    assert_equal [match], Match.involving(@creator).to_a
    assert_equal [match], Match.involving(@heir).to_a
  end

  test 'partner_for は当事者の一方から見た相手を返す' do
    match = Match.appeal(heir_id: @heir.id, creator_id: @creator.id).tap(&:save!)

    assert_equal @heir, match.partner_for(@creator)
    assert_equal @creator, match.partner_for(@heir)
  end

  test 'with_active_parties は退会した当事者の行を落とす' do
    Match.appeal(heir_id: @heir.id, creator_id: @creator.id).save!
    @heir.soft_delete

    assert_empty Match.with_active_parties.involving(@creator)
  end

  test 'answer_appeal はアピールにだけ回答し、スカウトには触らない' do
    Match.scout(creator_id: @creator.id, heir_id: @heir.id).save!

    assert_nil Match.answer_appeal(creator_id: @creator.id, heir_id: @heir.id, accepted: true)
    assert_nil Match.scouts.first.is_ok

    answered = Match.answer_scout(heir_id: @heir.id, creator_id: @creator.id, accepted: false)
    assert_equal false, answered.reload.is_ok
  end

  test '作成時は user が後継者・target_user が職人でなければ無効（自分自身も不可）' do
    other_heir = build_heir('OtherRoleHeir')

    assert_not Match.appeal(heir_id: @heir.id, creator_id: other_heir.id).valid?
    assert_not Match.appeal(heir_id: @heir.id, creator_id: @heir.id).valid?
    assert_not Match.scout(creator_id: @creator.id, heir_id: @creator.id).valid?
    assert Match.appeal(heir_id: @heir.id, creator_id: @creator.id).valid?
  end
end
