# 日記フィード(一覧)表示に必要なクエリ一式をまとめて構築する。
# select_diary/my_diary/your_diary/heir_favorite_diaryで共通の複雑な
# クエリチェーンがコピペされていたのをここに集約する。
class DiaryFeedQueryService
  def self.build(target_ids:, viewer_id:, sample_good_avatars: false)
    diary_user = User.joins(:diaries)
                     .where(diaries: { user_id: target_ids })
                     .select('diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time',
                             'users.*')
                     .order('diaries.created_at DESC')
    diary_ids = diary_user.map(&:diaries_id)

    comment = User.joins(:diary_comments)
                  .where(diary_comments: { diary_id: diary_ids })
                  .select('diary_comments.*, diary_comments.created_at AS post_time, users.*')
    comment_count = DiaryComment.where(diary_id: diary_ids).group(:diary_id).count
    good = DiaryGood.where(diary_id: diary_ids).group(:diary_id).count

    good_user = Diary.joins(:diary_goods)
                     .where(diary_goods: { diary_id: Diary.where(user_id: target_ids).select(:id) })
                     .select('diary_goods.user_id')
    good_avatar_scope = User.joins(:diary_goods)
                            .where(id: good_user)
                            .select('diary_goods.*, diary_goods.diary_id, users.*')
    good_avatar = sample_good_avatars ? good_avatar_scope.random_sample(5) : good_avatar_scope

    my_good = Diary.joins(:diary_goods)
                   .where(diaries: { user_id: target_ids })
                   .where(diary_goods: { user_id: viewer_id })
                   .select('diaries.id AS id')
                   .order('diaries.created_at DESC')

    {
      diaries: diary_user,
      comments: comment,
      comment_count: comment_count,
      good: good,
      good_avatar: good_avatar,
      my_good: my_good,
    }
  end
end
