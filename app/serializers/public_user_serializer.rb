# 他ユーザーに見せてよいプロフィール項目のみを含む表現。
# email / password_digest / 各種トークンは意図的に含めない。
class PublicUserSerializer < ApplicationSerializer
  attributes :id, :name, :is_man, :profile

  attribute(:avatar_path) { |user| image_url(user.avatar_path) }
  attribute(:birthday)    { |user| user.birthday.to_s }
end
