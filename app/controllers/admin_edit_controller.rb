class AdminEditController < ApplicationController
  include AdminAuthentication

  before_action :require_admin
  ADMIN_LIST_PER_PAGE = 20

  def index
    render :admin_index
  end

  def user
    render_admin_list(:admin_user_edit, :users, User.with_deleted.order(created_at: :desc)) do |u|
      {
        id: u.id,
        name: u.name,
        avatarPath: u.avatar_path.to_s,
        profile: u.profile.to_s,
        createdAt: u.created_at.to_s,
        deletedAt: u.deleted_at&.to_s,
        loginTime: u.login_time&.to_s,
      }
    end
  end

  def diary
    render_admin_list(:admin_diary_edit, :diaries, Diary.with_deleted.order(created_at: :desc)) do |d|
      {
        id: d.id,
        userId: d.user_id,
        content: d.content.to_s,
        createdAt: d.created_at.to_s,
        deletedAt: d.deleted_at&.to_s,
      }
    end
  end

  def diary_comment
    render_admin_list(:admin_diary_comment_edit, :comments, DiaryComment.with_deleted.order(created_at: :desc)) do |c|
      {
        id: c.id,
        userId: c.user_id,
        diaryId: c.diary_id,
        comment: c.comment.to_s,
        createdAt: c.created_at.to_s,
        deletedAt: c.deleted_at&.to_s,
      }
    end
  end

  def gallery
    render_admin_list(:admin_gallery_edit, :galleries, Gallery.with_deleted.order(created_at: :desc)) do |g|
      {
        id: g.id,
        userId: g.user_id,
        data: g.data.to_s,
        comment: g.comment.to_s,
        createdAt: g.created_at.to_s,
        deletedAt: g.deleted_at&.to_s,
      }
    end
  end

  def inquiry
    scope = Inquiry.with_deleted.joins(:inquiry_category).select('inquiries.*, inquiry_categories.name AS name').order('inquiries.created_at DESC')
    render_admin_list(:admin_inquiry_edit, :inquiries, scope) do |q|
      {
        id: q.id,
        userId: q.user_id,
        name: q.name,
        content: q.content.to_s,
        isCheck: q.is_check,
        createdAt: q.created_at.to_s,
        updatedAt: q.updated_at.to_s,
        deletedAt: q.deleted_at&.to_s,
        elapsedDays: ((Time.zone.now - q.created_at) / 86_400).to_i,
      }
    end
  end

  # ユーザー削除
  def user_delete
    soft_delete_and_redirect(User, '/admin/management/user')
  end

  # ユーザー編集
  def user_edit_show
    render_user_edit(User.with_deleted.find(params.expect(:id)))
  end

  # patch
  def user_edit
    user = User.with_deleted.find(params.expect(:id))
    if user.update(params.expect(user: %i[avatar_path profile]))
      flash[:success] = t('flash.success.saved')
      redirect_to '/admin/management/user'
    else
      flash.now[:danger] = t('flash.danger.error')
      # 失敗した値ではなく保存済みの内容で編集画面を出し直す
      render_user_edit(user.reload, status: :unprocessable_content)
    end
  end

  # ダイアリー削除
  def diary_delete
    soft_delete_and_redirect(Diary, '/admin/management/diary')
  end

  # ダイアリーコメント削除
  def diary_comment_delete
    soft_delete_and_redirect(DiaryComment, '/admin/management/diary_comment')
  end

  # ギャラリー削除
  def gallery_delete
    soft_delete_and_redirect(Gallery, '/admin/management/gallery')
  end

  # お問い合わせ詳細表示
  def inquiry_detail_show
    @inquiry = Inquiry.new
    @inquiry_detail = Inquiry.find(params.expect(:id))
    @category = InquiryCategory.find(@inquiry_detail.inquiry_category_id)
    @page_props = {
      inquiryDetail: {
        id: @inquiry_detail.id,
        categoryName: @category.name,
        content: @inquiry_detail.content.to_s,
        createdAt: @inquiry_detail.created_at.to_s,
      },
      isCheck: @inquiry_detail.is_check ? true : false,
      flash: flash.to_h,
    }
    render :inquiry_detail
  end

  # お問い合わせ対応
  def inquiry_detail_check
    is_check = params.expect(inquiry: [:is_check])[:is_check]
    # update_all は更新件数を返す。0 も truthy なので件数で判定する
    flash_result(Inquiry.where(id: params[:id]).update_all(is_check: is_check, admin_id: Current.admin.id).positive?)
    redirect_to '/admin/management/inquiry'
  end

  private

  # 管理画面の一覧ページ。scope を ADMIN_LIST_PER_PAGE 件ずつに区切り、
  # 1行分の props をブロックで組み立てて `key` の配列として渡す。
  def render_admin_list(template, key, scope, &)
    pagy, records = pagy(scope, limit: ADMIN_LIST_PER_PAGE)
    @page_props = {
      key => records.map(&),
      pagination: pagination_props(pagy),
      flash: flash.to_h,
    }
    render template
  end

  def render_user_edit(user, status: :ok)
    @page_props = {
      user: {
        id: user.id,
        avatarPath: user.avatar_path.to_s,
        profile: user.profile.to_s,
      },
      flash: flash.to_h,
    }
    render :selected_user_edit, status: status
  end

  # 削除済みのレコードは model.find で見つからず 404 になる（二重削除はしない）
  def soft_delete_and_redirect(model, redirect_path)
    flash_result(model.find(params.expect(:id)).soft_delete)
    redirect_to redirect_path
  end

  def flash_result(succeeded)
    if succeeded
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
  end
end
