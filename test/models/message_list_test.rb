require 'test_helper'

class MessageListTest < ActiveSupport::TestCase
  include UserFactory

  setup do
    @creator = build_creator('ThreadCreator')
    @heir = build_heir('ThreadHeir')
    @match = Match.appeal(heir_id: @heir.id, creator_id: @creator.id).tap do |m|
      m.update!(is_ok: true)
    end
  end

  test 'open_between はどちらから開いても職人/後継者の向きで登録し、マッチに追加済みを立てる' do
    assert MessageList.open_between(@heir, @creator.id)

    assert MessageList.exists?(creator_user_id: @creator.id, heir_user_id: @heir.id)
    assert @match.reload.is_add_list
  end

  test 'open_between は既に追加済みなら false を返し、二重に登録しない' do
    assert MessageList.open_between(@creator, @heir.id)

    assert_not MessageList.open_between(@heir, @creator.id)
    assert_equal 1, MessageList.where(creator_user_id: @creator.id, heir_user_id: @heir.id).count
  end
end
