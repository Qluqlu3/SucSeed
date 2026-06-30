require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def build_user(overrides = {})
    User.new({
      name: 'テストユーザ',
      email: "test_#{SecureRandom.hex(4)}@example.com",
      birthday: Date.new(1990, 1, 1),
      is_man: true,
      password: 'password123',
      password_confirmation: 'password123'
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
                   password: 'password123', password_confirmation: 'password123'
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

  # ── トークン期限メソッド ────────────────────────────────────────────

  test 'password_reset_token_expired? — 61 分前なら true' do
    user = build_user
    user.password_reset_sent_at = 61.minutes.ago
    assert user.password_reset_token_expired?
  end

  test 'password_reset_token_expired? — 59 分前なら false' do
    user = build_user
    user.password_reset_sent_at = 59.minutes.ago
    assert_not user.password_reset_token_expired?
  end

  test 'email_verification_token_expired? — 25 時間前なら true' do
    user = build_user
    user.email_verification_sent_at = 25.hours.ago
    assert user.email_verification_token_expired?
  end

  test 'email_verification_token_expired? — 23 時間前なら false' do
    user = build_user
    user.email_verification_sent_at = 23.hours.ago
    assert_not user.email_verification_token_expired?
  end

  # ── generate_password_reset_token! ─────────────────────────────────

  test 'generate_password_reset_token! がトークンとタイムスタンプをセット' do
    user = users(:alice)
    user.generate_password_reset_token!
    user.reload
    assert_not_nil user.password_reset_token
    assert_in_delta Time.current.to_i, user.password_reset_sent_at.to_i, 5
  end
end
