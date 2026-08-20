# 「後継者を募集中の職人一覧」を組み立てるクエリオブジェクト。
#
# トップページ・検索・地図ページ・API の4箇所で同じ join + select が
# コピペされていたのをここに集約する。
#
# users を主体に creators を join しているのは CreatorCardSerializer が
# users.* の列（name / avatar_path / created_at）を必要とするため。
class RecruitingCreatorsQuery
  COLUMNS = 'users.*, creators.title, creators.user_id, creators.prefecture_code'.freeze

  # @param art_category_id [Integer, nil] 指定時はその分野のみ
  # @param exclude_user_id [String, nil]  指定時はそのユーザーを除外（自分自身を出さない用途）
  def self.call(art_category_id: nil, exclude_user_id: nil)
    conditions = { is_recruitment: true }
    conditions[:art_category_id] = art_category_id if art_category_id.present?

    scope = User.joins(:creator).select(COLUMNS).where(creators: conditions)
    scope = scope.where.not(creators: { user_id: exclude_user_id }) if exclude_user_id.present?
    scope
  end
end
