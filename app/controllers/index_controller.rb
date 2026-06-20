class IndexController < ApplicationController
  def index
    if session[:id].present? && session[:creator].present?
      @creator = User.joins(:creator).select('users.*, creators.title, creators.user_id').where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true })
    elsif session[:id].present? && session[:creator].nil?
      @creator = User.joins(:creator).select('users.*, creators.title, creators.user_id').where(creators: { is_recruitment: true })
      @interest = Heir.select('heirs.art_category_id').find_by(user_id: session[:id])
      @recommend = User.joins(:creator).select('users.*, creators.title, creators.user_id').where(creators: { art_category_id: @interest }).where(creators: { is_recruitment: true }).order('RAND()').limit(4)
    else
      @creator = User.joins(:creator).select('users.*, creators.title, creators.user_id').where(creators: { is_recruitment: true })
    end
    @page_props = {
      creators: @creator.map do |c|
        {
          userId: c.user_id,
          name: c.name,
          title: c.title,
          avatarPath: c.avatar_path.to_s,
          createdAt: c.created_at
        }
      end,
      recommend: @recommend&.map do |c|
        {
          userId: c.user_id,
          name: c.name,
          title: c.title,
          avatarPath: c.avatar_path.to_s,
          createdAt: c.created_at
        }
      end,
      loggedIn: session[:id].present?,
      isCreator: session[:creator].present?,
      flash: flash.to_h
    }
  end

  def root
    redirect_to '/index'
  end

  def search_user
    if params[:search][:art_category_id] == ''
      redirect_to '/index'
    else
      if session[:creator].present?
        @creator = User.joins(:creator).select('users.*, creators.title, creators.user_id').where.not(creators: { user_id: session[:id] }).where(creators: { is_recruitment: true }).where(creators: { art_category_id: params[:search][:art_category_id] })
      else
        @creator = User.joins(:creator).select('users.*, creators.title, creators.user_id').where(creators: { is_recruitment: true }).where(creators: { art_category_id: params[:search][:art_category_id] })
      end
      @page_props = {
        creators: @creator.map do |c|
          {
            userId: c.user_id,
            name: c.name,
            title: c.title,
            avatarPath: c.avatar_path.to_s,
            createdAt: c.created_at
          }
        end,
        flash: flash.to_h
      }
      render :search_user
    end
  end
end
