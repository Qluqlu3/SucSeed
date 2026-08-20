# マッチング（アピール / スカウト）1件の表現。
#
# matches テーブルは向きが固定されていて、user_id が常に後継者、
# target_user_id が常に職人を指す。is_scout はどちらから声を掛けたかのフラグ。
# 生の user_id / target_user_id だけだとフロント側で毎回この対応を思い出す必要が
# あるため、heir / creator という意味のある名前で公開する。
class MatchSerializer < ApplicationSerializer
  attributes :is_scout, :is_ok, :is_add_list, :created_at

  attribute :heir_user_id, &:user_id
  attribute :creator_user_id, &:target_user_id

  attribute(:heir)    { |match| PublicUserSerializer.new(match.user).serializable_hash }
  attribute(:creator) { |match| PublicUserSerializer.new(match.target_user).serializable_hash }

  # 職人の屋号。一覧では creators を都度引かず、まとめて読んだものを params で渡す。
  attribute(:creator_title) { |match| params[:creator_titles]&.[](match.target_user_id) }

  def self.build(matches)
    matches = matches.to_a
    titles = Creator.where(user_id: matches.map(&:target_user_id)).pluck(:user_id, :title).to_h

    new(matches, params: { creator_titles: titles }).serializable_hash
  end
end
