class FavoriteController < ApplicationController
  before_action :require_login

  def add
    @favorite = Favorite.new(user_id: session[:id], favorite_user_id: params[:id])
    if @favorite.save
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to "/page/creator/#{params[:id]}"
  end

  def delete
    if Favorite.where(user_id: session[:id]).where(favorite_user_id: params[:id]).delete_all
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to "/page/creator/#{params[:id]}"
  end
end
