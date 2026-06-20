require 'test_helper'

class GmailMailerTest < ActionMailer::TestCase
  test 'send_create' do
    user = users(:one)
    mail = GmailMailer.send_create(user)
    assert_equal '登録完了', mail.subject
    assert_equal [user.email], mail.to
    assert_match user.name, mail.body.encoded
  end
end
