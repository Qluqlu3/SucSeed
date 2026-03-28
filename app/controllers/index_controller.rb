class IndexController < ApplicationController
  def index
    if session[:creator] != nil && session[:creator] != nil
      @creator = User.joins(:creator).select("users.*, creators.title, creators.user_id").where.not(creators: {user_id: session[:id]}).where(creators: {is_recruitment: true})
    elsif session[:id] != nil && session[:creator] == nil
      @creator = User.joins(:creator).select("users.*, creators.title, creators.user_id").where(creators: {is_recruitment: true})
      @interest = Heir.select("heirs.art_category_id").find_by(user_id: session[:id])
      @recommend = User.joins(:creator).select("users.*, creators.title, creators.user_id").where(creators: {art_category_id: @interest}).where(creators: {is_recruitment: true}).order("RAND()").limit(4)
    else
      @creator = User.joins(:creator).select("users.*, creators.title, creators.user_id").where(creators: {is_recruitment: true})
    end
  end

  def root
    redirect_to "/index"
  end

  def search_user
    if params[:search][:art_category_id] != ""
      if session[:creator] != nil
        @creator = User.joins(:creator).select("users.*, creators.title, creators.user_id").where.not(creators: {user_id: session[:id]}).where(creators: {is_recruitment: true}).where(creators: {art_category_id: params[:search][:art_category_id]})
      else
        @creator = User.joins(:creator).select("users.*, creators.title, creators.user_id").where(creators: {is_recruitment: true}).where(creators: {art_category_id: params[:search][:art_category_id]})
      end
      @page_props = {
        creators: @creator.map { |c|
          {
            userId:     c.user_id,
            name:       c.name,
            title:      c.title,
            avatarPath: c.avatar_path.to_s,
            createdAt:  c.created_at,
          }
        },
      }
      render :search_user
    else
      redirect_to "/index"
    end
  end
end