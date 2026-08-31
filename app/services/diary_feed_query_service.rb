# 日記フィード(一覧)表示に必要なクエリ一式をまとめて構築する。
# select_diary/my_diary/your_diary/heir_favorite_diary と API の日記一覧で共用する。
#
# 「対象の日記を絞り込むスコープ」と「その日記に対する集計」を分けているのは、
# API 側がページネーションしてから集計したいため。集計対象をページ内に限定しないと
# 1ページ分を返すのに全件分の集計クエリが走ってしまう。
#
#   scope = DiaryFeedQueryService.scope_for(user_ids)
#   pagy, diaries = pagy(scope)                       # ページを切り出してから
#   feed = DiaryFeedQueryService.build(diaries:, ...) # そのページ分だけ集計する
#
# 戻り値は素の ActiveRecord オブジェクトと集計ハッシュのみで、JSON 化は
# DiarySerializer.from_feed が受け持つ。
class DiaryFeedQueryService
  # 「いいねした人のアバター」を並べる際の最大表示数
  GOOD_AVATAR_LIMIT = 5

  # 対象ユーザーの日記スコープ。ページネーションは呼び出し側で行う。
  def self.scope_for(target_ids)
    Diary.where(user_id: target_ids).includes(:user).order(created_at: :desc)
  end

  def self.build(diaries:, viewer_id:, sample_good_avatars: false)
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
