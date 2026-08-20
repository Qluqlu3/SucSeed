# 後継者プロフィールの詳細表現。
class HeirSerializer < ApplicationSerializer
  attributes :user_id, :art_category_id

  attribute(:introduction)      { |heir| heir.introduction.to_s }
  attribute(:art_category_name) { |heir| heir.art_category&.name }
  attribute(:user)              { |heir| PublicUserSerializer.new(heir.user).serializable_hash }

  attribute(:is_scouted) { |heir| params[:scouted_user_ids]&.include?(heir.user_id) || false }
  attribute(:is_own)     { |heir| heir.user_id == params[:viewer_id] }
end
