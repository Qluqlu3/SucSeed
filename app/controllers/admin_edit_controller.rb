class AdminEditController < ApplicationController
  before_action :session_check
  def index
    render :admin_index
  end

  def user
    @user = User.with_deleted.order(created_at: :desc)
    @page_props = {
      users: @user.map do |u|
        {
          id: u.id,
          name: u.name,
          avatarPath: u.avatar_path.to_s,
          profile: u.profile.to_s,
          createdAt: u.created_at.to_s,
          deletedAt: u.deleted_at&.to_s,
          loginTime: u.login_time&.to_s
        }
      end,
      flash: flash.to_h
    }
    render :admin_user_edit
  end

  def diary
    @diary = Diary.with_deleted.order(created_at: :desc)
    @page_props = {
      diaries: @diary.map do |d|
        {
          id: d.id,
          userId: d.user_id,
          content: d.content.to_s,
          createdAt: d.created_at.to_s,
          deletedAt: d.deleted_at&.to_s
        }
      end,
      flash: flash.to_h
    }
    render :admin_diary_edit
  end

  def diary_comment
    @diary_comment = DiaryComment.with_deleted.order(created_at: :desc)
    @page_props = {
      comments: @diary_comment.map do |c|
        {
          id: c.id,
          userId: c.user_id,
          diaryId: c.diary_id,
          comment: c.comment.to_s,
          createdAt: c.created_at.to_s,
          deletedAt: c.deleted_at&.to_s
        }
      end,
      flash: flash.to_h
    }
    render :admin_diary_comment_edit
  end

  def gallery
    @gallery = Gallery.with_deleted.order(created_at: :desc)
    @page_props = {
      galleries: @gallery.map do |g|
        {
          id: g.id,
          userId: g.user_id,
          data: g.data.to_s,
          comment: g.comment.to_s,
          createdAt: g.created_at.to_s,
          deletedAt: g.deleted_at&.to_s
        }
      end,
      flash: flash.to_h
    }
    render :admin_gallery_edit
  end

  def inquiry
    @inquiry = Inquiry.with_deleted.joins(:inquiry_category).select('inquiries.*, inquiry_categories.name AS name').order('inquiries.created_at DESC')
    @page_props = {
      inquiries: @inquiry.map do |q|
        {
          id: q.id,
          userId: q.user_id,
          name: q.name,
          content: q.content.to_s,
          isCheck: q.is_check == 1,
          createdAt: q.created_at.to_s,
          updatedAt: q.updated_at.to_s,
          deletedAt: q.deleted_at&.to_s,
          elapsedDays: ((Time.zone.now - q.created_at) / 86_400).to_i
        }
      end,
      flash: flash.to_h
    }
    render :admin_inquiry_edit
  end

  # ユーザー削除
  def user_delete
    if User.find(params[:id]).soft_delete
      flash[:success] = 'success'
    else
      flash[:danger] = 'error'
    end
    redirect_to '/admin/management/user'
  end

  # ユーザー編集
  def user_edit_show
    @user = User.with_deleted.find_by(id: params[:id])
    @page_props = {
      user: {
        id: @user.id,
        avatarPath: @user.avatar_path.to_s,
        profile: @user.profile.to_s
      },
      flash: flash.to_h
    }
    render :selected_user_edit
  end

  # patch
  def user_edit
    user = User.with_deleted.find_by(id: params[:id])
    if user.update(avatar_path: params[:user][:avatar_path], profile: params[:user][:profile])
      flash[:success] = 'success'
      redirect_to '/admin/management/user'
    else
      flash.now[:danger] = 'error'
    end
  end

  # ダイアリー削除
  def diary_delete
    if Diary.find(params[:id]).soft_delete
      flash[:success] = 'success'
    else
      flash[:danger] = 'error'
    end
    redirect_to '/admin/management/diary'
  end

  # ダイアリーコメント削除
  def diary_comment_delete
    if DiaryComment.find(params[:id]).soft_delete
      flash[:success] = 'success'
    else
      flash[:danger] = 'error'
    end
    redirect_to '/admin/management/diary_comment'
  end

  # ギャラリー削除
  def gallery_delete
    if Gallery.find(params[:id]).soft_delete
      flash[:success] = 'success'
    else
      flash[:danger] = 'error'
    end
    redirect_to '/admin/management/gallery'
  end

  # お問い合わせ詳細表示
  def inquiry_detail_show
    @inquiry = Inquiry.new
    @inquiry_detail = Inquiry.find_by(id: params[:id])
    @category = InquiryCategory.find(@inquiry_detail.inquiry_category_id)
    @page_props = {
      inquiryDetail: {
        id: @inquiry_detail.id,
        categoryName: @category.name,
        content: @inquiry_detail.content.to_s,
        createdAt: @inquiry_detail.created_at.to_s
      },
      isCheck: @inquiry_detail.is_check ? true : false,
      flash: flash.to_h
    }
    @check = if @inquiry_detail.is_check
               true
             else
               false
             end
    render :inquiry_detail
  end

  # お問い合わせ対応
  def inquiry_detail_check
    if Inquiry.where(id: params[:id]).update_all(is_check: params[:inquiry][:is_check], admin_id: session[:admin])
      flash[:success] = 'success'
    else
      flash[:danger] = 'エラー'
    end
    redirect_to '/admin/management/inquiry'
  end

  private

  def session_check
    return unless session[:admin].nil?

    redirect_to '/admin/login'
  end
end
