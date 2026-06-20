class FavoriteController < ApplicationController
  def add
    if session[:id].present?
      @favorite = Favorite.new(user_id: session[:id], favorite_user_id: params[:id])
      if @favorite.save
        flash[:success] = 'success'
      else
        flash[:danger] = 'エラー'
      end
      redirect_to "/page/creator/#{params[:id]}"
    else
      redirect_to '/index'
    end
  end

  def delete
    if session[:id].present?
      if Favorite.where(user_id: session[:id]).where(favorite_user_id: params[:id]).delete_all
        flash[:success] = 'success'
      else
        flash[:danger] = 'エラー'
      end
      redirect_to "/page/creator/#{params[:id]}"
    else
      redirect_to '/index'
    end
  end
end
