class CreatorController < ApplicationController
  def show
    if session[:creator] != nil && !Creator.find_by(user_id: session[:id])
      @creator = Creator.new
      @art_categories = ArtCategory.all
      render :create
    else
      @creator = User.joins(:creator).select("users.*, creators.*").find_by(creators: {user_id: session[:id]})
      @category = ArtCategory.find(@creator.art_category_id)
      render :show
    end
  end

  def create
    @art_categories = ArtCategory.all
    params[:creator][:user_id] = session[:id]
    @creator = Creator.new(creator_params)
    if @creator.save
      flash.now[:success] = "success"
      redirect_to "/creator/show"
    else
      render :create
    end
  end

  def edit
    if session[:creator] != nil
      @creator = ArtCategory.joins(:creators).select("creators.*, art_categories.name").find_by(creators: {user_id: session[:id]})
      if @creator.is_recruitment == 1
        @check = true
      else
        @check = false
      end
      render :update
    end
  end

  def update
    if Creator.find_by(user_id: session[:id]).update_attributes(title: params[:art_category][:title], art_category_id: params[:art_category][:art_category_id], establishment: params[:art_category][:establishment], employee: params[:art_category][:employee], postal_code: params[:art_category][:postal_code], is_recruitment: params[:art_category][:is_recruitment])
      flash[:success] = "success"
      redirect_to "/creator/show"
    else
      flash[:danger] = "エラー"
      redirect_to "/creator/edit"
    end
  end

  # def data
  #   if session[:creator] != nil
  #     @count = CreatorImage.where(user_id: session[:id]).count
  #     if @count > 0
  #       @get_image = CreatorImage.where(user_id: session[:id])
  #     end
  #     @creator_image = CreatorImage.new
  #     render :upload_image
  #   else
  #     redirect_to "/index"
  #   end
  # end

  # def upload
  #   if session[:creator] != nil
  #     params[:creator_image][:user_id] = session[:id]
  #     @creator_image = CreatorImage.new(image_params)
  #     if @creator_image.save
  #       flash[:success] = "success"
  #       redirect_to "/creator/upload"
  #     else
  #       flash[:danger] = "エラー"
  #       redirect_to "/creator/upload"
  #     end
  #   end
  # end

  # def delete
  #   @creator_image = CreatorImage.find_by(id: params[:id])
  #   @creator_image.destroy
  #   redirect_to "/creator/upload"
  # end
end

private
def creator_params
  params.require(:creator).permit(:user_id, :title, :art_category_id, :establishment, :employee, :postal_code, :is_recruitment)
end

# def image_params
#   params.require(:creator_image).permit(:user_id, :media_data, :created_at, :updated_at)
# end
