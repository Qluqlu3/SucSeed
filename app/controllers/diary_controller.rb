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
    feed = diary_feed(Current.user_id, sample_good_avatars: true)
    @page_props = {
      diaries: DiarySerializer.from_feed(feed),
      errors: [],
      flash: flash.to_h,
      currentUser: current_user_props,
    }
  end

  # 相手ページからの日記
  def your_diary
    feed = diary_feed(params[:id], sample_good_avatars: true)
    @name = User.select('users.name').find(params.expect(:id))
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

  # 後継者側お気に入り
  def heir_favorite_diary
    @page_props = favorite_feed_props
    render :diary_heir_favorite
  end

  private

  # お気に入りユーザー（+自分）の日記フィード。select_diary と heir_favorite_diary で共通。
  def favorite_feed_props
    feed = diary_feed(Favorite.self_and_favorite_ids(Current.user_id))
    {
      diaries: DiarySerializer.from_feed(feed),
      currentUser: current_user_props,
      flash: flash.to_h,
    }
  end

  # HTML 側はページネーションせず全件表示する（従来どおり）。
  # 件数が増えたらここを pagy に置き換える。
  def diary_feed(target_ids, sample_good_avatars: false)
    DiaryFeedQueryService.build(
      diaries: DiaryFeedQueryService.scope_for(target_ids),
      viewer_id: Current.user_id,
      sample_good_avatars: sample_good_avatars,
    )
  end

  def diary_params
    params.expect(diary: [:content, { diary_media_attributes: [:media_data] }])
  end
end
