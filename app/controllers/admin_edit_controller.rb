class AdminEditController < ApplicationController
  before_action :session_check
  def index
    render :admin_index
  end

  def user
    @user = User.all.order("created_at DESC")
    @page_props = {
      users: @user.map { |u| {
        id: u.id,
        name: u.name,
        avatarPath: u.avatar_path.to_s,
        profile: u.profile.to_s,
        createdAt: u.created_at.to_s,
        deletedAt: u.deleted_at&.to_s,
        loginTime: u.login_time&.to_s
      }}
    }
    render :admin_user_edit
  end

  def diary
    @diary = Diary.all.order("created_at DESC")
    @page_props = {
      diaries: @diary.map { |d| {
        id: d.id,
        userId: d.user_id,
        content: d.content.to_s,
        createdAt: d.created_at.to_s,
        deletedAt: d.deleted_at&.to_s
      }}
    }
    render :admin_diary_edit
  end

  def diary_comment
    @diary_comment = DiaryComment.all.order("created_at DESC")
    @page_props = {
      comments: @diary_comment.map { |c| {
        id: c.id,
        userId: c.user_id,
        diaryId: c.diary_id,
        comment: c.comment.to_s,
        createdAt: c.created_at.to_s,
        deletedAt: c.deleted_at&.to_s
      }}
    }
    render :admin_diary_comment_edit
  end

  def gallery
    @gallery = Gallery.all.order("created_at DESC")
    render :'admin_edit/admin_gallery_edit'
  end

  def inquiry
    @inquiry = InquiryCategory.joins(:inquiry).select("inquiries.*, inquiry_categories.name").order("inquiries.created_at DESC")
    render :admin_inquiry_edit
  end

  #ユーザー削除
  def user_delete
    if User.delete(params[:id])
      flash[:success] = "success"
      render action: :user
    else
      flash[:danger] = "error"
    end
  end

  #ユーザー編集
  def user_edit_show
    @user = User.find_by("id = ?", params[:id])
    render :selected_user_edit
  end

  #patch
  def user_edit
    user = User.find_by("id = ?", params[:id])
    if user.update_attributes(:avatar_path => params[:user][:avatar_path], :profile => params[:user][:profile])
      flash[:success] = "success"
      redirect_to "/admin/management/user"
    else
      flash.now[:danger] = "error"
    end
  end

  #ダイアリー削除
  def diary_delete
    if Diary.delete(params[:id])
      flash[:success] = "success"
      redirect_to "/admin/management/diary"
    else
      flash[:danger] = "error"
      render :diary
    end
  end

  #ダイアリーコメント削除
  def diary_comment_delete
    if DiaryComment.delete(params[:id])
      flash[:success] = "success"
      redirect_to "/admin/management/diary_comment"
    else
      flash[:danger] = "error"
      render :diary_comment
    end
  end

  #ギャラリー削除
  def gallery_delete
    if Gallery.delete(params[:id])
      flash[:success] = "success"
      redirect_to "/admin/management/gallery"
    else
      flash[:danger] = "error"
      render :gallery
    end
  end

  #お問い合わせ詳細表示
  def inquiry_detail_show
    @inquiry = Inquiry.new
    @inquiry_detail = Inquiry.find_by("id = ?", params[:id])
    @category = InquiryCategory.find(@inquiry_detail.inquiry_category_id)
    if @inquiry_detail.is_check
      @check = true
    else
      @check = false
    end
    render :inquiry_detail
  end

  #お問い合わせ対応
  def inquiry_detail_check
    if Inquiry.where("id = ?", params[:id]).update_all(:is_check => params[:inquiry][:is_check], :admin_id => session[:admin])
      flash[:success] = "success"
      redirect_to "/admin/management/inquiry"
    else
      flash[:danger] = "エラー"
      redirect_to "/admin/management/inquiry"
    end
  end

  private
  def session_check
    if session[:admin] == nil
      redirect_to "/admin/index"
    end
  end
end
