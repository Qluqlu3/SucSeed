class DiaryController < ApplicationController
  before_action :require_login, except: %i[your_diary heir_user_diary comment_delete]

  # 投稿フォーム表示
  def regist
    if session[:creator].present?
      @diary = Diary.new
      @user = User.find(session[:id])
      @page_props = {
        errors: [],
        flash: flash.to_h,
        userName: @user.name,
        avatarPath: @user.avatar_path.to_s,
      }
    else
      redirect_to '/index'
    end
  end

  # 投稿+画像もあればアップロード
  def post
    if session[:creator].present?
      @diary = Diary.new(diary_params.merge(user_id: session[:id]))
      if @diary.save
        flash[:success] = t('flash.success.saved')
      else
        flash[:danger] = t('flash.danger.error')
      end
      redirect_to '/diary/my_diary'
    else
      redirect_to '/index'
    end
  end

  # お気に入りにしたユーザの日記一覧
  def select_diary
    @user = User.find(session[:id])
    feed = DiaryFeedQueryService.build(target_ids: Favorite.self_and_favorite_ids(session[:id]), viewer_id: session[:id])
    @page_props = {
      diaries: DiaryFeedPresenter.build(**feed),
      currentUser: { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s },
      flash: flash.to_h,
    }
    render :select_diary
  end

  # マイ日記
  def my_diary
    @user = User.find(session[:id])
    feed = DiaryFeedQueryService.build(target_ids: session[:id], viewer_id: session[:id], sample_good_avatars: true)
    @page_props = {
      diaries: DiaryFeedPresenter.build(**feed),
      errors: [],
      flash: flash.to_h,
      currentUser: { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s },
    }
  end

  # 相手ページからの日記
  def your_diary
    @user = User.find(session[:id]) if session[:id].present?
    feed = DiaryFeedQueryService.build(target_ids: params[:id], viewer_id: session[:id], sample_good_avatars: true)
    @name = User.select('users.name').find(params[:id])
    @page_props = {
      diaries: DiaryFeedPresenter.build(**feed),
      ownerName: @name.name,
      targetUserId: params[:id].to_i,
      targetIsCreator: Creator.exists?(user_id: params[:id]),
      currentUser: session[:id] ? { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s } : nil,
      flash: flash.to_h,
    }
  end

  # 投稿削除
  def post_delete
    diary = Diary.find_by(id: params[:id], user_id: session[:id])
    if diary&.soft_delete
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to '/diary/my_diary'
  end

  # いいねボタン
  def good
    @diary_good = DiaryGood.new(diary_id: params[:id], user_id: session[:id])
    fallback = session[:creator] ? '/diary/view' : '/diary/heir/favorite'
    if @diary_good.save
      respond_to do |f|
        f.html do
          flash[:success] = t('flash.success.saved')
          redirect_to fallback
        end
        f.json { head :ok }
      end
    else
      respond_to do |f|
        f.html do
          flash[:danger] = t('flash.danger.error')
          redirect_to fallback
        end
        f.json { head :unprocessable_content }
      end
    end
  end

  # コメント
  def comment
    @diary_comment = DiaryComment.new(diary_comment_params.merge(user_id: session[:id], diary_id: params[:id]))
    fallback = session[:creator] ? '/diary/view' : '/diary/heir/favorite'
    if @diary_comment.save
      respond_to do |f|
        f.html do
          flash[:success] = t('flash.success.saved')
          redirect_to fallback
        end
        f.json { head :ok }
      end
    else
      respond_to do |f|
        f.html do
          flash[:danger] = t('flash.danger.error')
          redirect_to fallback
        end
        f.json { head :unprocessable_content }
      end
    end
  end

  def comment_delete; end

  # 後継者側お気に入り
  def heir_favorite_diary
    @user = User.find(session[:id])
    feed = DiaryFeedQueryService.build(target_ids: Favorite.self_and_favorite_ids(session[:id]), viewer_id: session[:id])
    @page_props = {
      diaries: DiaryFeedPresenter.build(**feed),
      currentUser: { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s },
      flash: flash.to_h,
    }
    render :diary_heir_favorite
  end

  # 後継者側個別
  def heir_user_diary; end

  private

  def diary_params
    params.require(:diary).permit(:content, diary_media_attributes: [:media_data])
  end

  def diary_comment_params
    params.require(:diary_comment).permit(:comment)
  end
end
