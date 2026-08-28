require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def build_user(overrides = {})
    User.new({
      name: 'テストユーザ',
      email: "test_#{SecureRandom.hex(4)}@example.com",
      birthday: Date.new(1990, 1, 1),
      is_man: true,
      password: 'password123',
      password_confirmation: 'password123',
    }.merge(overrides))
  end

  # ── バリデーション ──────────────────────────────────────────────────

  test 'name が空なら invalid' do
    user = build_user(name: '')
    assert user.invalid?
    assert user.errors[:name].any?
  end

  test 'email が空なら invalid' do
    user = build_user(email: '')
    assert user.invalid?
    assert user.errors[:email].any?
  end

  test 'email の形式が不正なら invalid' do
    %w[not-email @example.com user@ user@.com].each do |bad|
      assert build_user(email: bad).invalid?, "#{bad} は invalid のはずが valid だった"
    end
  end

  test 'email が正しい形式なら valid' do
    assert build_user(email: 'user@example.com').valid?
  end

  test '同じ email で 2 件目は invalid' do
    email = "dup_#{SecureRandom.hex(4)}@example.com"
    User.create!(build_user(email: email).attributes.except('id').merge(
                   password: 'password123', password_confirmation: 'password123',
                 ))
    dup = build_user(email: email)
    assert dup.invalid?
    assert dup.errors[:email].any?
  end

  test 'password が 7 文字なら invalid' do
    user = build_user(password: 'pass123', password_confirmation: 'pass123')
    assert user.invalid?
    assert user.errors[:password].any?
  end

  test 'password が 17 文字なら invalid' do
    long = 'a' * 17
    user = build_user(password: long, password_confirmation: long)
    assert user.invalid?
    assert user.errors[:password].any?
  end

  test 'password が 8 文字なら valid' do
    user = build_user(password: 'pass1234', password_confirmation: 'pass1234')
    assert user.valid?
  end

  test 'password が 16 文字なら valid' do
    p16 = 'a' * 16
    user = build_user(password: p16, password_confirmation: p16)
    assert user.valid?
  end

  # ── avatar_path (CarrierWave: AvatarUploader) ──────────────────────

  test '本物の画像なら valid' do
    user = build_user(avatar_path: File.open(file_fixture('valid_image.png')))
    assert user.valid?, user.errors.full_messages.to_s
  end

  test '拡張子だけ画像に偽装したファイルは invalid（マジックバイトによるcontent_type検証）' do
    user = build_user(avatar_path: File.open(file_fixture('fake_image.jpg')))
    assert user.invalid?
    assert user.errors[:avatar_path].any? { |m| m.include?('形式') }, user.errors.full_messages.to_s
  end

  test '実体は画像でも許可されていない拡張子なら invalid（拡張子検証）' do
    user = build_user(avatar_path: File.open(file_fixture('valid_image_wrong_ext.gif')))
    assert user.invalid?
    assert user.errors[:avatar_path].any? { |m| m.include?('拡張子') }, user.errors.full_messages.to_s
  end

  # ── email の正規化 (normalizes) ─────────────────────────────────────

  test 'email は前後の空白を除去して小文字に正規化される' do
    user = build_user(email: '  MiXeD@Example.COM  ')
    assert_equal 'mixed@example.com', user.email
  end

  test 'find_by も正規化されたメールアドレスで引ける' do
    assert_equal users(:alice), User.find_by(email: ' ALICE@Example.com ')
  end

  # ── パスワードリセットトークン (has_secure_password reset_token) ────

  test 'password_reset_token は署名付きで find_by_password_reset_token から引ける' do
    user = users(:alice)
    assert_equal user, User.find_by_password_reset_token(user.password_reset_token)
  end

  test 'password_reset_token は 1 時間で失効する' do
    token = users(:alice).password_reset_token

    travel 59.minutes
    assert_not_nil User.find_by_password_reset_token(token)

    travel 2.minutes
    assert_nil User.find_by_password_reset_token(token)
  end

  test 'password_reset_token はパスワード変更で自動的に無効になる' do
    user = users(:alice)
    token = user.password_reset_token

    user.update!(password: 'newpass99', password_confirmation: 'newpass99')
    assert_nil User.find_by_password_reset_token(token)
  end

  test 'password_reset_token は改竄されると引けない' do
    assert_nil User.find_by_password_reset_token('tampered')
  end

  test '他人のトークンで別ユーザーを引くことはできない' do
    token = users(:alice).password_reset_token
    assert_not_equal users(:creator_bob), User.find_by_password_reset_token(token)
  end

  # ── メールアドレス認証トークン (generates_token_for) ────────────────

  test 'email_verification_token は find_by_email_verification_token から引ける' do
    user = users(:unverified)
    assert_equal user, User.find_by_email_verification_token(user.email_verification_token)
  end

  test 'email_verification_token は 24 時間で失効する' do
    token = users(:unverified).email_verification_token

    travel 23.hours
    assert_not_nil User.find_by_email_verification_token(token)

    travel 2.hours
    assert_nil User.find_by_email_verification_token(token)
  end

  test 'email_verification_token はメールアドレス変更で自動的に無効になる' do
    user = users(:unverified)
    token = user.email_verification_token

    user.update!(email: 'changed@example.com')
    assert_nil User.find_by_email_verification_token(token)
  end

  test 'email_verification_token は改竄されると引けない' do
    assert_nil User.find_by_email_verification_token('tampered')
  end
end
