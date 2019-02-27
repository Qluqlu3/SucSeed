class GalleryController < ApplicationController

  #お気に入りユーザのギャラリー
  def favorite_gallery
    if session[:id] != nil
      @gallery = Gallery.new
      @favorite_gallery = Gallery.joins(:user).select("users.*, galleries.*, galleries.id AS page_id").where(galleries: {user_id: session[:id]}).or(Gallery.joins(:user).select("users.*, galleries.*, galleries.id AS page_id").where(galleries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).order("galleries.created_at DESC")
      @good_count = GalleryGood.group(:gallery_id).count
      @my_good = Gallery.joins(:gallery_goods).where(gallery_goods: {user_id: session[:id]}).where(galleries: {user_id: session[:id]}).or(Gallery.joins(:gallery_goods).where(galleries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).select("galleries.id AS id").order("galleries.created_at DESC")
      render :favorite_gallery
    else
      redirect_to "/index"
    end
  end

  #マイギャラリー
  def my_gallery
    if session[:id] != nil
      @gallery = Gallery.new
      @my_good = Gallery.joins(:gallery_goods).where(gallery_goods: {user_id: session[:id]}).where(galleries: {user_id: session[:id]}).or(Gallery.joins(:gallery_goods).where(galleries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).select("galleries.id AS id").order("galleries.created_at DESC")
      @my_gallery = Gallery.where(user_id: session[:id]).order("created_at DESC")
      render :my_gallery
    else
      redirect_to "/index"
    end
  end

  #ユーザ別ギャラリー
  def user_view
    @gallery = Gallery.new
    @user = User.find_by("id = ?", params[:id])
    @user_gallery = Gallery.joins(:user).select("users.name", "galleries.*").where(galleries: {user_id: params[:id]}).order("galleries.created_at DESC")
    @my_good = Gallery.joins(:gallery_goods).where(gallery_goods: {user_id: session[:id]}).where(galleries: {user_id: params[:id]}).order("galleries.created_at DESC")
    @good_count = GalleryGood.group(:gallery_id).count
    render :user_gallery_view
  end

  #投稿 post
  def upload
    if session[:creator] != nil
      params[:gallery][:user_id] = session[:creator]
      @gallery = Gallery.new(gallery_params)
      if @gallery.save
        flash[:success] = "success"
      else
        flash[:danger] = "エラー"
      end
      redirect_to "/gallery/my_gallery"
    else
      redirect_to "/index"
    end
  end

  #個別画像
  def selected_gallery
    @selected_gallery = Gallery.find_by("id = ?", params[:id])
    @user = User.find_by("id = ?", @selected_gallery.user_id)
    @selected_gallery_user = User.joins(:creator).select("users.name, users.avatar_path, creators.user_id, creators.title, creators.establishment, creators.employee").find_by(users: {id: @selected_gallery.user_id})
    @good_count = GalleryGood.group(:gallery_id).count
    @comment = User.joins(:gallery_comments).select("gallery_comments.*, gallery_comments.created_at AS post_time, users.*").order("gallery_comments.created_at DESC")
    @comment_count = GalleryComment.group(:gallery_id).count
    @my_good = Gallery.joins(:gallery_goods).where(gallery_goods: {user_id: session[:id]}).where(galleries: {user_id: session[:id]}).or(Gallery.joins(:gallery_goods).where(galleries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).select("galleries.id AS id").order("galleries.created_at DESC")
    @gallery_comment = GalleryComment.new
    #タグ検索
    @match_tag = Gallery.tagged_with([@selected_gallery.tag_list], :any => true).where.not(user_id: @selected_gallery.user_id).order("RAND()").limit(3)
    #ユーザの他投稿
    @other_gallery = Gallery.where(user_id: @selected_gallery.user_id).where.not("id = ?", params[:id]).order("RAND()").limit(2)
  end

  #タグ検索
  def search_user_tag
    if params[:search_tag] != ""
      @gallery = Gallery.new
      @user = User.find_by("id = ?", params[:id])
      @user_gallery = Gallery.tagged_with([params[:search_tag]], :any => true).where("user_id = ?", params[:id])
      render :gallery_search_user_tag
    end
  end

  #後継者側のお気に入り
  def heir_favorite_gallery
    if session[:id] != nil
      @favorite_gallery = Gallery.joins(:user).select("users.*, galleries.*, galleries.id AS page_id").where(galleries: {user_id: session[:id]}).or(Gallery.joins(:user).select("users.*, galleries.*, galleries.id AS page_id").where(galleries: {user_id: Favorite.where(user_id: session[:id]).select("favorites.favorite_user_id")})).order("galleries.created_at DESC")
      render :heir_favorite_gallery
    else
      redirect_to "/index"
    end
  end

  def gallery_good
    if session[:id] != nil
      @selected_gallery = GalleryGood.new(gallery_id: params[:id], user_id: session[:id])
      if @selected_gallery.save
        flash[:success] = "success"
        redirect_to "/gallery/selected/#{params[:id]}"
      else
        flash[:danger] = "エラ−"
        redirect_to "/gallery/selected/#{params[:id]}"
      end
    else
      flash[:danger] = "ログインしてください"
      redirect_to "/gallery/selected/#{params[:id]}"
    end
  end

  def gallery_comment
    if session[:id] != nil
      params[:gallery_comment][:gallery_id] = params[:id]
      params[:gallery_comment][:user_id] = session[:id]
      @selected_gallery = GalleryComment.new(gallery_comment_params)
      if @selected_gallery.save
        flash[:success] = "success"
        redirect_to "/gallery/selected/#{params[:id]}"
      else
        flash[:danger] = "コメントを入力してください"
        redirect_to "/gallery/selected/#{params[:id]}"
      end
    else
      flash[:danger] = "ログインしてください"
      redirect_to "/gallery/selected/#{params[:id]}"
    end
  end

end

private
def gallery_params
  params.require(:gallery).permit(:user_id, :data, :comment, :tag_list)
end

private
def gallery_comment_params
  params.require(:gallery_comment).permit(:gallery_id, :user_id, :comment)
end