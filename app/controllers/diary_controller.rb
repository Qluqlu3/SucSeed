class DiaryController < ApplicationController
  before_action :require_login, except: [:your_diary]
  before_action :require_creator, only: %i[regist post]

  # 投稿フォーム表示
  def regist
    @diary = Diary.new
    @page_props = {
      errors: [],
      flash: flash.to_h,
      userName: Current.user.name,
      avatarPath: Current.user.avatar_path.to_s,
    }
  end

  # 投稿+画像もあればアップロード
  def post
    @diary = Diary.new(diary_params.merge(user_id: Current.user_id))
    if @diary.save
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to '/diary/my_diary'
  end

  # お気に入りにしたユーザの日記一覧
  def select_diary
    @page_props = favorite_feed_props
    render :select_diary
  end

  # マイ日記
  def my_diary
    feed = DiaryFeedQueryService.build(target_ids: Current.user_id, viewer_id: Current.user_id, sample_good_avatars: true)
    @page_props = {
      diaries: DiarySerializer.from_feed(feed),
      errors: [],
      flash: flash.to_h,
      currentUser: current_user_props,
    }
  end

  # 相手ページからの日記
  def your_diary
    feed = DiaryFeedQueryService.build(target_ids: params[:id], viewer_id: Current.user_id, sample_good_avatars: true)
    @name = User.select('users.name').find(params[:id])
    @page_props = {
      diaries: DiarySerializer.from_feed(feed),
      ownerName: @name.name,
      targetUserId: params[:id],
      targetIsCreator: Creator.exists?(user_id: params[:id]),
      currentUser: current_user_props,
      flash: flash.to_h,
    }
  end

  # 投稿削除
  def post_delete
    diary = Diary.find_by(id: params[:id], user_id: Current.user_id)
    if diary&.soft_delete
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to '/diary/my_diary'
  end

  # いいねボタン
  def good
    diary_good = DiaryGood.new(diary_id: params[:id], user_id: Current.user_id)
    respond_with_save(diary_good.save)
  end

  # コメント
  def comment
    diary_comment = DiaryComment.new(diary_comment_params.merge(user_id: Current.user_id, diary_id: params[:id]))
    respond_with_save(diary_comment.save)
  end

  # 後継者側お気に入り
  def heir_favorite_diary
    @page_props = favorite_feed_props
    render :diary_heir_favorite
  end

  private

  # お気に入りユーザー（+自分）の日記フィード。select_diary と heir_favorite_diary で共通。
  def favorite_feed_props
    feed = DiaryFeedQueryService.build(target_ids: Favorite.self_and_favorite_ids(Current.user_id), viewer_id: Current.user_id)
    {
      diaries: DiarySerializer.from_feed(feed),
      currentUser: current_user_props,
      flash: flash.to_h,
    }
  end

  # いいね/コメントは React 側から fetch されるため JSON、
  # JS 無効時のフォーム送信にも備えて HTML リダイレクトの両方を返す。
  def respond_with_save(saved)
    fallback = Current.creator? ? '/diary/view' : '/diary/heir/favorite'
    respond_to do |format|
      format.html do
        flash[saved ? :success : :danger] = t(saved ? 'flash.success.saved' : 'flash.danger.error')
        redirect_to fallback
      end
      format.json { head saved ? :ok : :unprocessable_content }
    end
  end

  def diary_params
    params.require(:diary).permit(:content, diary_media_attributes: [:media_data])
  end

  def diary_comment_params
    params.require(:diary_comment).permit(:comment)
  end
end
