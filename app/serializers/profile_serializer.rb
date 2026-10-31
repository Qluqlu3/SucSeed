# ログイン中ユーザー自身のプロフィール（frontend/api/types.ts の Profile）。
# API の GET /api/v1/profile と HTML のマイページ・プロフィール編集画面で共用する。
#
# 本人にだけ見せる表現なので email を含む。他人に見せる場合は PublicUserSerializer を使うこと。
class ProfileSerializer < ApplicationSerializer
  attributes :id, :name, :email, :profile, :is_man, :is_certified, :role

  attribute(:avatar_path) { |user| image_url(user.avatar_path) }
  attribute(:birthday)    { |user| user.birthday.to_s }
  # 職人/後継者の詳細プロフィールが未登録なら、フロントが登録導線を出す
  attribute(:detail_registered, &:detail_profile_registered?)
end
