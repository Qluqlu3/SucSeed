# 日記フィード1件の表現。
#
# いいね数・コメント・自分がいいね済みかは DiaryFeedQueryService がまとめて
# 集計したものを params 経由で受け取る（1件ずつ引くと N+1 になるため）。
class DiarySerializer < ApplicationSerializer
  attributes :user_id, :content

  # フロント側の型は diaryId。id は Diary の主キーそのもの。
  attribute :diary_id, &:id
  attribute(:name)        { |diary| diary.user.name }
  attribute(:avatar_path) { |diary| image_url(diary.user.avatar_path) }
  attribute(:post_time)   { |diary| display_time(diary.created_at) }

  attribute(:good_count)    { |diary| params[:good_count][diary.id] || 0 }
  attribute(:comment_count) { |diary| params[:comment_count][diary.id] || 0 }
  attribute(:my_good)       { |diary| params[:my_good_ids].include?(diary.id) }

  attribute(:good_avatars) do |diary|
    goods = params[:good_avatars_by_diary][diary.id] || []
    goods = goods.first(params[:good_avatar_limit]) if params[:good_avatar_limit]
    goods.map { |good| { 'avatarPath' => image_url(good.user.avatar_path) } }
  end

  attribute(:comments) do |diary|
    CommentSerializer.new(params[:comments_by_diary][diary.id] || []).serializable_hash
  end

  # 集計を伴わない単体表示用（投稿直後のレスポンスなど）。
  # いいね0件・コメント0件の状態を表すため、集計は空で渡す。
  def self.for_new_record(diary)
    new(diary, params: {
          comments_by_diary: {}, comment_count: {}, good_count: {},
          good_avatars_by_diary: {}, my_good_ids: Set.new, good_avatar_limit: nil
        }).serializable_hash
  end

  # DiaryFeedQueryService.build の戻り値をそのまま渡してフィードを描画する。
  def self.from_feed(feed)
    new(
      feed[:diaries],
      params: {
        comments_by_diary: feed[:comments].group_by(&:diary_id),
        comment_count: feed[:comment_count],
        good_count: feed[:good_count],
        good_avatars_by_diary: feed[:good_avatars].group_by(&:diary_id),
        my_good_ids: feed[:my_good_ids],
        good_avatar_limit: feed[:good_avatar_limit],
      },
    ).serializable_hash
  end
end
