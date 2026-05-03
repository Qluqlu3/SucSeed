class DiaryController < ApplicationController
  #投稿フォーム表示
  def regist
    if session[:creator] != nil
      @diary = Diary.new
      @user = User.find(session[:id])
      @page_props = {
        errors:     [],
        flash:      flash.to_h,
        userName:   @user.name,
        avatarPath: @user.avatar_path.to_s
      }
    else
      redirect_to "/index"
    end
  end

  #投稿+画像もあればアップロード
  def post
    if session[:creator] != nil
      params[:diary][:user_id] = session[:id]
      @diary = Diary.new(diary_params)
      if @diary.save
        flash[:success] = "success"
      else
        flash[:danger] = "エラー"
      end
      redirect_to "/diary/my_diary"
    else
      redirect_to "/index"
    end
  end

  #お気に入りにしたユーザの日記一覧
  def select_diary
    @diary_user = User.joins(:diaries).where(diaries: {user_id: session[:id]}).or(User.joins(:diaries).where(diaries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).select("diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.*").order("diaries.created_at DESC")
    #@diary_user = User.find_by_sql('SELECT diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.* FROM users INNER JOIN diaries ON diaries.user_id = users.id INNER JOIN favorites ON favorites.user_id = users.id WHERE(diaries.user_id = ?) OR (diaries.user_id IN (SELECT favorites.favorite_user_id FROM favorites WHERE favorites.user_id = ?)) ORDER BY(diaries.created_at DESC)',session[:id], session[:id])
    @user = User.find(session[:id])
    @comment = User.joins(:diary_comments).select("diary_comments.*, diary_comments.created_at AS post_time, users.*")
    @comment_count = DiaryComment.group(:diary_id).count
    @diary_good = DiaryGood.new
    @good = DiaryGood.group(:diary_id).count
    @diary_comment = DiaryComment.new
    @favorite_user = Favorite.where(user_id: session[:id]).select("favorite_user_id")
    @good_user = Diary.joins(:diary_goods).where(diary_goods: {diary_id: Diary.where(user_id: @favorite_user).select("diaries.id")}).select("diary_goods.user_id")
    @good_avatar = User.joins(:diary_goods).where(id: @good_user).select("diary_goods.*, diary_goods.diary_id, users.*")
    @my_good = Diary.joins(:diary_goods).where(diary_goods: {user_id: session[:id]}).where(diaries: {user_id: session[:id]}).or(Diary.joins(:diary_goods).where(diaries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).select("diaries.id AS id").order("diaries.created_at DESC")
    #投稿機能
    @diary = Diary.new
    # @diary.diary_media.build
    @user = User.find(session[:id])
    @page_props = {
      diaries: @diary_user.map { |d|
        {
          diaryId:      d.diaries_id,
          userId:       d.user_id,
          name:         d.name,
          avatarPath:   d.avatar_path.to_s,
          content:      d.content,
          postTime:     d.post_time.strftime("%Y/%m/%d %H:%M"),
          goodCount:    @good[d.diaries_id] || 0,
          goodAvatars:  @good_avatar.select { |ga| ga.diary_id == d.diaries_id }.map { |ga| { avatarPath: ga.avatar_path.to_s } },
          myGood:       @my_good.any? { |mg| mg.id == d.diaries_id },
          comments:     @comment.select { |c| c.diary_id == d.diaries_id }.map { |c|
            { name: c.name, avatarPath: c.avatar_path.to_s, comment: c.comment, postTime: c.post_time.strftime("%Y/%m/%d %H:%M") }
          },
          commentCount: @comment_count[d.diaries_id] || 0
        }
      },
      currentUser: {
        id:         @user.id,
        name:       @user.name,
        avatarPath: @user.avatar_path.to_s
      },
      flash: flash.to_h
    }
    render :select_diary
  end

  #マイ日記
  def my_diary
    if session[:id] != nil
      @diary_user = User.joins(:diaries).where(diaries: {user_id: session[:id]}).select("diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.*").order("diaries.created_at DESC")
      @user = User.find_by(id: session[:id])
      @comment = User.joins(:diary_comments).select("diary_comments.*, diary_comments.created_at AS post_time, users.*")
      @comment_count = DiaryComment.group(:diary_id).count
      @diary_good = DiaryGood.new
      @good = DiaryGood.group(:diary_id).count
      @diary_comment = DiaryComment.new
      @good_user = Diary.joins(:diary_goods).where(diary_goods: {diary_id: Diary.where(user_id: session[:id]).select("diaries.id")}).select("diary_goods.user_id")
      @good_avatar = User.joins(:diary_goods).where(id: @good_user).select("diary_goods.*, diary_goods.diary_id, users.*").order("RAND()").limit(5)
      @my_good = Diary.joins(:diary_goods).where(diaries: {user_id: session[:id]}).where(diary_goods: {user_id: session[:id]}).select("diaries.id AS id").order("diaries.created_at DESC")
      #投稿機能
      @diary = Diary.new
      # @diary.diary_media.build
      @user = User.find(session[:id])
      @page_props = {
        diaries: @diary_user.map { |d|
          {
            diaryId:     d.diaries_id,
            userId:      d.user_id,
            name:        d.name,
            avatarPath:  d.avatar_path.to_s,
            content:     d.content,
            postTime:    d.post_time.strftime("%Y/%m/%d %H:%M"),
            goodCount:   @good[d.diaries_id] || 0,
            goodAvatars: @good_avatar.select { |ga| ga.diary_id == d.diaries_id }.map { |ga| { avatarPath: ga.avatar_path.to_s } },
            myGood:      @my_good.any? { |mg| mg.id == d.diaries_id },
            comments:    @comment.select { |c| c.diary_id == d.diaries_id }.map { |c|
              { name: c.name, avatarPath: c.avatar_path.to_s, comment: c.comment, postTime: c.post_time.strftime("%Y/%m/%d %H:%M") }
            },
            commentCount: @comment_count[d.diaries_id] || 0
          }
        },
        errors:  @diary.errors.full_messages,
        flash:   flash.to_h,
        currentUser: {
          id:         @user.id,
          name:       @user.name,
          avatarPath: @user.avatar_path.to_s
        }
      }
    else
      redirect_to "/index"
    end
  end

  #相手ページからの日記
  def your_diary
    @diary_user = User.joins(:diaries).where(diaries: {user_id: params[:id]}).select("diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.*").order("diaries.created_at DESC")
    if session[:id] != nil
      @user = User.find(session[:id])
    end
    @comment = User.joins(:diary_comments).select("diary_comments.*, diary_comments.created_at AS post_time, users.*")
    @comment_count = DiaryComment.group(:diary_id).count
    @diary_good = DiaryGood.new
    @good = DiaryGood.group(:diary_id).count
    @diary_comment = DiaryComment.new
    @good_user = Diary.joins(:diary_goods).select("diary_goods.user_id").where(diary_goods: {diary_id: Diary.where(user_id: params[:id]).select("diaries.id")})
    @good_avatar = User.joins(:diary_goods).where(id: @good_user).select("diary_goods.*, diary_goods.diary_id, users.*").order("RAND()").limit(5)
    @my_good = Diary.joins(:diary_goods).where(diaries: {user_id: params[:id]}).where(diary_goods: {user_id: session[:id]}).select("diaries.id AS id").order("diaries.created_at DESC")
    @name = User.select("users.name").find(params[:id])
    @page_props = {
      diaries: @diary_user.map { |d|
        {
          diaryId:      d.diaries_id,
          userId:       d.user_id,
          name:         d.name,
          avatarPath:   d.avatar_path.to_s,
          content:      d.content,
          postTime:     d.post_time.strftime("%Y/%m/%d %H:%M"),
          goodCount:    @good[d.diaries_id] || 0,
          goodAvatars:  @good_avatar.select { |ga| ga.diary_id == d.diaries_id }.map { |ga| { avatarPath: ga.avatar_path.to_s } },
          myGood:       @my_good.any? { |mg| mg.id == d.diaries_id },
          comments:     @comment.select { |c| c.diary_id == d.diaries_id }.map { |c|
            { name: c.name, avatarPath: c.avatar_path.to_s, comment: c.comment, postTime: c.post_time.strftime("%Y/%m/%d %H:%M") }
          },
          commentCount: @comment_count[d.diaries_id] || 0
        }
      },
      ownerName:   @name.name,
      currentUser: session[:id] ? { id: @user.id, name: @user.name, avatarPath: @user.avatar_path.to_s } : nil,
      flash: flash.to_h
    }
  end

  #投稿削除
  def post_delete
    if session[:id] != nil
      if Diary.where(id: params[:id]).where(user_id: session[:id]).destroy_all
        flash[:success] = "success"
        redirect_to "/diary/my_diary"
      else
        flash[:danger] = "エラー"
        redirect_to "/diary/my_diary"
      end
    else
      redirect_to "/index"
    end
  end

  #いいねボタン
  def good
    unless session[:id]
      respond_to do |f|
        f.html { redirect_to "/index" }
        f.json { head :unauthorized }
      end
      return
    end
    @diary_good = DiaryGood.new(diary_id: params[:id], user_id: session[:id])
    fallback = session[:creator] ? "/diary/view" : "/diary/heir/favorite"
    if @diary_good.save
      respond_to do |f|
        f.html { flash[:success] = "success"; redirect_to fallback }
        f.json { head :ok }
      end
    else
      respond_to do |f|
        f.html { flash[:danger] = "エラー"; redirect_to fallback }
        f.json { head :unprocessable_entity }
      end
    end
  end

  #コメント
  def comment
    unless session[:id]
      respond_to do |f|
        f.html { redirect_to "/index" }
        f.json { head :unauthorized }
      end
      return
    end
    params[:diary_comment][:user_id] = session[:id]
    params[:diary_comment][:diary_id] = params[:id]
    @diary_comment = DiaryComment.new(diary_comment_params)
    fallback = session[:creator] ? "/diary/view" : "/diary/heir/favorite"
    if @diary_comment.save
      respond_to do |f|
        f.html { flash[:success] = "success"; redirect_to fallback }
        f.json { head :ok }
      end
    else
      respond_to do |f|
        f.html { flash[:danger] = "エラー"; redirect_to fallback }
        f.json { head :unprocessable_entity }
      end
    end
  end

  def comment_delete
    if session[:id] != nil
    else

    end
  end

  #後継者側お気に入り
  def heir_favorite_diary
    if session[:id] != nil
      @diary_user = User.joins(:diaries).where(diaries: {user_id: session[:id]}).or(User.joins(:diaries).where(diaries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).select("diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.*").order("diaries.created_at DESC")
      #@diary_user = User.find_by_sql('SELECT diaries.*, diaries.id AS diaries_id, diaries.created_at AS post_time, users.* FROM users INNER JOIN diaries ON diaries.user_id = users.id INNER JOIN favorites ON favorites.user_id = users.id WHERE(diaries.user_id = ?) OR (diaries.user_id IN (SELECT favorites.favorite_user_id FROM favorites WHERE favorites.user_id = ?)) ORDER BY(diaries.created_at DESC)',session[:id], session[:id])
      @user = User.find(session[:id])
      @comment = User.joins(:diary_comments).select("diary_comments.*, diary_comments.created_at AS post_time, users.*")
      @comment_count = DiaryComment.group(:diary_id).count
      @diary_good = DiaryGood.new
      @good = DiaryGood.group(:diary_id).count
      @diary_comment = DiaryComment.new
      @favorite_user = Favorite.where(user_id: session[:id]).select("favorite_user_id")
      @good_user = Diary.joins(:diary_goods).where(diary_goods: {diary_id: Diary.where(user_id: @favorite_user).select("diaries.id")}).select("diary_goods.user_id")
      @good_avatar = User.joins(:diary_goods).where(id: @good_user).select("diary_goods.*, diary_goods.diary_id, users.*")
      @my_good = Diary.joins(:diary_goods).where(diary_goods: {user_id: session[:id]}).where(diaries: {user_id: session[:id]}).or(Diary.joins(:diary_goods).where(diaries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).select("diaries.id AS id").order("diaries.created_at DESC")
      # @diary.diary_media.build
      @user = User.find(session[:id])
      @page_props = {
        diaries: @diary_user.map { |d|
          {
            diaryId:      d.diaries_id,
            userId:       d.user_id,
            name:         d.name,
            avatarPath:   d.avatar_path.to_s,
            content:      d.content,
            postTime:     d.post_time.strftime("%Y/%m/%d %H:%M"),
            goodCount:    @good[d.diaries_id] || 0,
            goodAvatars:  @good_avatar.select { |ga| ga.diary_id == d.diaries_id }.map { |ga| { avatarPath: ga.avatar_path.to_s } },
            myGood:       @my_good.any? { |mg| mg.id == d.diaries_id },
            comments:     @comment.select { |c| c.diary_id == d.diaries_id }.map { |c|
              { name: c.name, avatarPath: c.avatar_path.to_s, comment: c.comment, postTime: c.post_time.strftime("%Y/%m/%d %H:%M") }
            },
            commentCount: @comment_count[d.diaries_id] || 0
          }
        },
        currentUser: {
          id:         @user.id,
          name:       @user.name,
          avatarPath: @user.avatar_path.to_s
        },
        flash: flash.to_h
      }
      render :diary_heir_favorite
    else
      redirect_to "/index"
    end
  end

  #後継者側個別
  def heir_user_diary

  end
end

private

def diary_params
  params.require(:diary).permit(:user_id, :content, diary_media_attributes: [:media_data])
end

def diary_comment_params
  params.require(:diary_comment).permit(:diary_id, :user_id, :comment)
end