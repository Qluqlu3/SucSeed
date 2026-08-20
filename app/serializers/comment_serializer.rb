# 日記コメント / ギャラリーコメントの共通表現。
# どちらも comment / created_at / user という同じ形なので1つのシリアライザで賄う。
#
# user を参照するので、コレクションを渡す際は includes(:user) しておくこと。
class CommentSerializer < ApplicationSerializer
  attributes :id, :comment

  attribute(:name)        { |record| record.user.name }
  attribute(:avatar_path) { |record| image_url(record.user.avatar_path) }
  attribute(:post_time)   { |record| display_time(record.created_at) }
end
