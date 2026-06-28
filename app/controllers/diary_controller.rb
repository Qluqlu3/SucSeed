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
        avatarPath: @user.avatar_path.to_s
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
        flash[:success] = 'success'
      else
        flash[:danger] = 'エラー'
      end
      redirect_to '/diary/my_diary'
    else
      redirect_to '/index'
    end
  end

  # お気に入りにしたユーザの日記一覧
  def select_diary
    @diary_user = User.joins(:diaries).where(diaries: { user_id: session[:id] }).or(User.joins(:diaries).where(diaries: { user_id: Favorite.where(user_id: session[:id]).select('favorites.favorite_user_id') })).select('diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.*').order('diaries.created_at DESC')
    @user = User.find(session[:id])
    diary_ids = @diary_user.map(&:diaries_id)
    @comment = User.joins(:diary_comments).where(diary_comments: { diary_id: diary_ids }).select('diary_comments.*, diary_comments.created_at AS post_time, users.*')
    @comment_count = DiaryComment.where(diary_id: diary_ids).group(:diary_id).count
    @diary_good = DiaryGood.new
    @good = DiaryGood.where(diary_id: diary_ids).group(:diary_id).count
    @diary_comment = DiaryComment.new
    @favorite_user = Favorite.where(user_id: session[:id]).select('favorite_user_id')
    @good_user = Diary.joins(:diary_goods).where(diary_goods: { diary_id: Diary.where(user_id: @favorite_user).select('diaries.id') }).select('diary_goods.user_id')
    @good_avatar = User.joins(:diary_goods).where(id: @good_user).select('diary_goods.*, diary_goods.diary_id, users.*')
    @my_good = Diary.joins(:diary_goods).where(diary_goods: { user_id: session[:id] }).where(diaries: { user_id: session[:id] }).or(Diary.joins(:diary_goods).where(diaries: { user_id: Favorite.where(user_id: session[:id]).select('favorites.favorite_user_id') })).select('diaries.id AS id').order('diaries.created_at DESC')
    @diary = Diary.new
    @page_props = {
      diaries: DiaryFeedPresenter.build(
        diaries: @diary_user, comments: @comment, comment_count: @comment_count,
        good: @good, good_avatar: @good_avatar, my_good: @my_good
      ),
      currentUser: { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s },
      flash: flash.to_h
    }
    render :select_diary
  end

  # マイ日記
  def my_diary
    @diary_user = User.joins(:diaries).where(diaries: { user_id: session[:id] }).select('diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.*').order('diaries.created_at DESC')
    @user = User.find(session[:id])
    diary_ids = @diary_user.map(&:diaries_id)
    @comment = User.joins(:diary_comments).where(diary_comments: { diary_id: diary_ids }).select('diary_comments.*, diary_comments.created_at AS post_time, users.*')
    @comment_count = DiaryComment.where(diary_id: diary_ids).group(:diary_id).count
    @diary_good = DiaryGood.new
    @good = DiaryGood.where(diary_id: diary_ids).group(:diary_id).count
    @diary_comment = DiaryComment.new
    @good_user = Diary.joins(:diary_goods).where(diary_goods: { diary_id: Diary.where(user_id: session[:id]).select('diaries.id') }).select('diary_goods.user_id')
    @good_avatar = User.joins(:diary_goods).where(id: @good_user).select('diary_goods.*, diary_goods.diary_id, users.*').order('RAND()').limit(5)
    @my_good = Diary.joins(:diary_goods).where(diaries: { user_id: session[:id] }).where(diary_goods: { user_id: session[:id] }).select('diaries.id AS id').order('diaries.created_at DESC')
    @diary = Diary.new
    @page_props = {
      diaries: DiaryFeedPresenter.build(
        diaries: @diary_user, comments: @comment, comment_count: @comment_count,
        good: @good, good_avatar: @good_avatar, my_good: @my_good
      ),
      errors: @diary.errors.full_messages,
      flash: flash.to_h,
      currentUser: { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s }
    }
  end

  # 相手ページからの日記
  def your_diary
    @diary_user = User.joins(:diaries).where(diaries: { user_id: params[:id] }).select('diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.*').order('diaries.created_at DESC')
    @user = User.find(session[:id]) if session[:id].present?
    diary_ids = @diary_user.map(&:diaries_id)
    @comment = User.joins(:diary_comments).where(diary_comments: { diary_id: diary_ids }).select('diary_comments.*, diary_comments.created_at AS post_time, users.*')
    @comment_count = DiaryComment.where(diary_id: diary_ids).group(:diary_id).count
    @diary_good = DiaryGood.new
    @good = DiaryGood.where(diary_id: diary_ids).group(:diary_id).count
    @diary_comment = DiaryComment.new
    @good_user = Diary.joins(:diary_goods).select('diary_goods.user_id').where(diary_goods: { diary_id: Diary.where(user_id: params[:id]).select('diaries.id') })
    @good_avatar = User.joins(:diary_goods).where(id: @good_user).select('diary_goods.*, diary_goods.diary_id, users.*').order('RAND()').limit(5)
    @my_good = Diary.joins(:diary_goods).where(diaries: { user_id: params[:id] }).where(diary_goods: { user_id: session[:id] }).select('diaries.id AS id').order('diaries.created_at DESC')
    @name = User.select('users.name').find(params[:id])
    @page_props = {
      diaries: DiaryFeedPresenter.build(
        diaries: @diary_user, comments: @comment, comment_count: @comment_count,
        good: @good, good_avatar: @good_avatar, my_good: @my_good
      ),
      ownerName: @name.name,
      currentUser: session[:id] ? { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s } : nil,
      flash: flash.to_h
    }
  end

  # 投稿削除
  def post_delete
    diary = Diary.find_by(id: params[:id], user_id: session[:id])
    if diary&.soft_delete
      flash[:success] = 'success'
    else
      flash[:danger] = 'エラー'
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
          flash[:success] = 'success'
          redirect_to fallback
        end
        f.json { head :ok }
      end
    else
      respond_to do |f|
        f.html do
          flash[:danger] = 'エラー'
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
          flash[:success] = 'success'
          redirect_to fallback
        end
        f.json { head :ok }
      end
    else
      respond_to do |f|
        f.html do
          flash[:danger] = 'エラー'
          redirect_to fallback
        end
        f.json { head :unprocessable_content }
      end
    end
  end

  def comment_delete; end

  # 後継者側お気に入り
  def heir_favorite_diary
    @diary_user = User.joins(:diaries).where(diaries: { user_id: session[:id] }).or(User.joins(:diaries).where(diaries: { user_id: Favorite.where(user_id: session[:id]).select('favorites.favorite_user_id') })).select('diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.*').order('diaries.created_at DESC')
    @user = User.find(session[:id])
    diary_ids = @diary_user.map(&:diaries_id)
    @comment = User.joins(:diary_comments).where(diary_comments: { diary_id: diary_ids }).select('diary_comments.*, diary_comments.created_at AS post_time, users.*')
    @comment_count = DiaryComment.where(diary_id: diary_ids).group(:diary_id).count
    @diary_good = DiaryGood.new
    @good = DiaryGood.where(diary_id: diary_ids).group(:diary_id).count
    @diary_comment = DiaryComment.new
    @favorite_user = Favorite.where(user_id: session[:id]).select('favorite_user_id')
    @good_user = Diary.joins(:diary_goods).where(diary_goods: { diary_id: Diary.where(user_id: @favorite_user).select('diaries.id') }).select('diary_goods.user_id')
    @good_avatar = User.joins(:diary_goods).where(id: @good_user).select('diary_goods.*, diary_goods.diary_id, users.*')
    @my_good = Diary.joins(:diary_goods).where(diary_goods: { user_id: session[:id] }).where(diaries: { user_id: session[:id] }).or(Diary.joins(:diary_goods).where(diaries: { user_id: Favorite.where(user_id: session[:id]).select('favorites.favorite_user_id') })).select('diaries.id AS id').order('diaries.created_at DESC')
    @page_props = {
      diaries: DiaryFeedPresenter.build(
        diaries: @diary_user, comments: @comment, comment_count: @comment_count,
        good: @good, good_avatar: @good_avatar, my_good: @my_good
      ),
      currentUser: { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s },
      flash: flash.to_h
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
