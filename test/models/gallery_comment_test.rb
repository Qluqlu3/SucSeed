require 'test_helper'

class GalleryCommentTest < ActiveSupport::TestCase
  test '#comment — 100文字以内なら有効' do
    comment = gallery_comments(:one)
    comment.comment = 'a' * 100
    assert comment.valid?
  end

  test '#comment — 101文字以上は無効(DBのvarchar(100)を超える)' do
    comment = gallery_comments(:one)
    comment.comment = 'a' * 101
    assert_not comment.valid?
    assert_includes comment.errors[:comment], I18n.t('errors.messages.too_long', count: 100)
  end
end
