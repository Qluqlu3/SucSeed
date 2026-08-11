require 'test_helper'

class MessageTest < ActiveSupport::TestCase
  test '#content — 1000文字以内なら有効' do
    message = messages(:one)
    message.content = 'a' * 1000
    assert message.valid?
  end

  test '#content — 1001文字以上は無効' do
    message = messages(:one)
    message.content = 'a' * 1001
    assert_not message.valid?
    assert_includes message.errors[:content], I18n.t('errors.messages.too_long', count: 1000)
  end
end
