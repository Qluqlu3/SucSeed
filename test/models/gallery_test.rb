require 'test_helper'

class GalleryTest < ActiveSupport::TestCase
  def build_gallery(data_path, comment: 'テスト画像')
    Gallery.new(user: users(:alice), comment: comment, data: File.open(data_path))
  end

  # ── data (CarrierWave: GalleryUploader) ────────────────────────────

  test '本物の画像なら valid' do
    gallery = build_gallery(file_fixture('valid_image.png'))
    assert gallery.valid?, gallery.errors.full_messages.to_s
  end

  test '拡張子だけ画像に偽装したファイルは invalid（マジックバイトによるcontent_type検証）' do
    gallery = build_gallery(file_fixture('fake_image.jpg'))
    assert gallery.invalid?
    assert gallery.errors[:data].any? { |m| m.include?('形式') }, gallery.errors.full_messages.to_s
  end

  test '実体は画像でも許可されていない拡張子なら invalid（拡張子検証）' do
    gallery = build_gallery(file_fixture('valid_image_wrong_ext.gif'))
    assert gallery.invalid?
    assert gallery.errors[:data].any? { |m| m.include?('拡張子') }, gallery.errors.full_messages.to_s
  end
end
