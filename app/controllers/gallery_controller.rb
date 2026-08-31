class GalleryController < ApplicationController
  before_action :require_login, except: %i[user_view upload selected_gallery search_user_tag]
  before_action :require_creator, only: [:upload]

  # お気に入りユーザのギャラリー
  def favorite_gallery
    @page_props = favorite_feed_props.merge(errors: [])
    render :favorite_gallery
  end

  # マイギャラリー
  def my_gallery
    feed = gallery_feed(Current.user_id)
    @page_props = {
      galleries: GallerySerializer.from_feed(feed),
      errors: [],
      flash: flash.to_h,
    }
    render :my_gallery
  end

  # ユーザ別ギャラリー
  def user_view
    @user = User.find(params.expect(:id))
    @user_gallery = Gallery.joins(:user).includes(:taggings, :tags).select('users.name', 'galleries.*')
                           .where(galleries: { user_id: params[:id] }).order('galleries.created_at DESC')
    gallery_ids = @user_gallery.map(&:id)
    @good_count = GalleryGood.where(gallery_id: gallery_ids).group(:gallery_id).count
    my_good_ids = GalleryGood.where(gallery_id: gallery_ids, user_id: Current.user_id).to_set(&:gallery_id)
    @page_props = {
      userName: @user.name,
      userId: @user.id,
      galleries: GallerySerializer.new(
        @user_gallery, params: { good_count: @good_count, my_good_ids: my_good_ids }
      ).serializable_hash,
      flash: flash.to_h,
    }
    render :user_gallery_view
  end

  # 投稿 post
  def upload
    @gallery = Gallery.new(gallery_params.merge(user_id: Current.user_id))
    if @gallery.save
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to '/gallery/my_gallery'
  end

  # 個別画像
  # 表示内容は API の GET /api/v1/galleries/:id と完全に同じものを使う。
  def selected_gallery
    @selected_gallery = Gallery.find(params.expect(:id))
    detail = GalleryDetailQueryService.build(@selected_gallery, viewer_id: Current.user_id)

    @page_props = GalleryDetailSerializer.new(detail).serializable_hash.merge(
      'loggedIn' => Current.logged_in?,
      # 旧実装は投稿者をそのまま currentUser として渡していたため、
      # コメント入力欄に「投稿者の名前とアバター」が出てしまっていた。
      'currentUser' => current_user_props,
      'flash' => flash.to_h,
    )
  end

  # タグ検索
  def search_user_tag
    return unless params[:search_tag] != ''

    @user = User.find(params.expect(:id))
    @user_gallery = Gallery.tagged_with([params[:search_tag]], any: true).includes(:taggings, :tags).where(user_id: params[:id])
    @page_props = {
      userName: @user.name,
      userId: @user.id,
      galleries: GallerySerializer.new(@user_gallery).serializable_hash,
      flash: flash.to_h,
    }
    render :gallery_search_user_tag
  end

  # 後継者側のお気に入り
  def heir_favorite_gallery
    @page_props = favorite_feed_props
    render :heir_favorite_gallery
  end

  def gallery_good
    gallery_good = GalleryGood.new(gallery_id: params[:id], user_id: Current.user_id)
    if gallery_good.save
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to "/gallery/selected/#{params[:id]}"
  end

  def gallery_comment
    gallery_comment = GalleryComment.new(gallery_comment_params.merge(gallery_id: params[:id], user_id: Current.user_id))
    if gallery_comment.save
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.comment_blank')
    end
    redirect_to "/gallery/selected/#{params[:id]}"
  end

  private

  # お気に入りユーザー（+自分）のギャラリーフィード。
  def favorite_feed_props
    feed = gallery_feed(Favorite.self_and_favorite_ids(Current.user_id))
    { galleries: GallerySerializer.from_feed(feed), flash: flash.to_h }
  end

  # HTML 側はページネーションせず全件表示する（従来どおり）。
  # 件数が増えたらここを pagy に置き換える。
  def gallery_feed(target_ids)
    GalleryFeedQueryService.build(
      galleries: GalleryFeedQueryService.scope_for(target_ids), viewer_id: Current.user_id,
    )
  end

  def gallery_params
    params.expect(gallery: %i[data comment tag_list])
  end

  def gallery_comment_params
    params.expect(gallery_comment: [:comment])
  end
end
