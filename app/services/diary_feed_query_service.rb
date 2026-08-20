# 日記フィード(一覧)表示に必要なクエリ一式をまとめて構築する。
# select_diary/my_diary/your_diary/heir_favorite_diary と API の日記一覧で共用する。
#
# 戻り値は素の ActiveRecord オブジェクトと集計ハッシュのみで、JSON 化は
# DiarySerializer.from_feed が受け持つ。
#
# 旧実装は `users.* + diaries.*` を1つの select に混ぜた行を返していたため、
# diaries.id を diaries_id という別名で持ち回る必要があり、boolean や日時の
# 型キャストも効かなかった。ここでは Diary / DiaryComment / DiaryGood を
# そのまま返し、関連は includes で先読みして N+1 を防ぐ。
class DiaryFeedQueryService
  # 「いいねした人のアバター」を並べる際の最大表示数
  GOOD_AVATAR_LIMIT = 5

  def self.build(target_ids:, viewer_id:, sample_good_avatars: false)
    diaries = Diary.where(user_id: target_ids)
                   .includes(:user)
                   .order(created_at: :desc)
    diary_ids = diaries.map(&:id)

    {
      diaries: diaries,
      comments: DiaryComment.where(diary_id: diary_ids).includes(:user),
      comment_count: DiaryComment.where(diary_id: diary_ids).group(:diary_id).count,
      good_count: DiaryGood.where(diary_id: diary_ids).group(:diary_id).count,
      good_avatars: DiaryGood.where(diary_id: diary_ids).includes(:user),
      my_good_ids: my_good_ids(diary_ids, viewer_id),
      good_avatar_limit: sample_good_avatars ? GOOD_AVATAR_LIMIT : nil,
    }
  end

  def self.my_good_ids(diary_ids, viewer_id)
    return Set.new if viewer_id.blank?

    DiaryGood.where(diary_id: diary_ids, user_id: viewer_id).pluck(:diary_id).to_set
  end
  private_class_method :my_good_ids
end
