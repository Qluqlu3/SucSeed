class IndexController < ApplicationController
  def index
    @creator = if session[:creator].present?
                 User.joins(:creator).select('users.*, creators.title, creators.user_id').where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true })
               else
                 User.joins(:creator).select('users.*, creators.title, creators.user_id').where(creators: { is_recruitment: true })
               end

    @recommend = if session[:id].present? && session[:creator].nil?
                   interest = Heir.select('heirs.art_category_id').find_by(user_id: session[:id])
                   User.joins(:creator).select('users.*, creators.title, creators.user_id').where(creators: { art_category_id: interest, is_recruitment: true }).order('RAND()').limit(4)
                 end

    @page_props = {
      creators: format_creators(@creator),
      recommend: @recommend&.then { |r| format_creators(r) },
      loggedIn: session[:id].present?,
      isCreator: session[:creator].present?,
      flash: flash.to_h
    }
  end

  def root
    redirect_to '/index'
  end

  def search_user
    return redirect_to '/index' if params[:search][:art_category_id] == ''

    @creator = if session[:creator].present?
                 User.joins(:creator).select('users.*, creators.title, creators.user_id').where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true, art_category_id: params[:search][:art_category_id] })
               else
                 User.joins(:creator).select('users.*, creators.title, creators.user_id').where(creators: { is_recruitment: true, art_category_id: params[:search][:art_category_id] })
               end

    @page_props = { creators: format_creators(@creator), flash: flash.to_h }
    render :search_user
  end

  private

  def format_creators(creators)
    creators = creators.to_a
    galleries_by_user = Gallery.where(user_id: creators.map(&:user_id))
                               .order(created_at: :desc)
                               .group_by(&:user_id)

    creators.map do |c|
      galleries = galleries_by_user[c.user_id] || []
      {
        userId: c.user_id,
        name: c.name,
        title: c.title,
        avatarPath: c.avatar_path.to_s,
        createdAt: c.created_at,
        galleryCount: galleries.size,
        galleryPreviewPath: galleries.first&.data&.to_s
      }
    end
  end
end
