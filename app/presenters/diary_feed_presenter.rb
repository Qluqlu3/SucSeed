class DiaryFeedPresenter
  def self.build(diaries:, comments:, comment_count:, good:, good_avatar:, my_good:)
    comment_by_diary     = comments.group_by(&:diary_id)
    good_avatar_by_diary = good_avatar.group_by(&:diary_id)
    my_good_ids          = my_good.map(&:id).to_set

    diaries.map do |d|
      id = d.diaries_id
      {
        diaryId:      id,
        userId:       d.user_id,
        name:         d.name,
        avatarPath:   d.avatar_path.to_s,
        content:      d.content,
        postTime:     d.post_time.strftime("%Y/%m/%d %H:%M"),
        goodCount:    good[id] || 0,
        goodAvatars:  (good_avatar_by_diary[id] || []).map { |ga| { avatarPath: ga.avatar_path.to_s } },
        myGood:       my_good_ids.include?(id),
        comments:     (comment_by_diary[id] || []).map { |c|
          { name: c.name, avatarPath: c.avatar_path.to_s, comment: c.comment, postTime: c.post_time.strftime("%Y/%m/%d %H:%M") }
        },
        commentCount: comment_count[id] || 0
      }
    end
  end
end
