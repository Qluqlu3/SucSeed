class HeirController < ApplicationController
  #詳細情報入力振り分け
  def heir_show
    if session[:id] != nil && !Heir.find_by(user_id: session[:id])
      @heir = Heir.new
      @art_categories = ArtCategory.all
      render :heir
    elsif session[:id] == nil
      redirect_to "/index"
    else
      @heir = Heir.find_by(user_id: session[:id])
      @interest = ArtCategory.find(@heir.art_category_id)
      render :show
    end
  end

  #詳細情報入力
  def heir_create
    if session[:id] != nil
      params[:heir][:user_id] = session[:id]
      @heir = Heir.new(heir_params)
      if @heir.save
        flash[:success] = "success"
        redirect_to "/heir/show"
      else
        flash[:danger] = "エラー"
        redirect_to "/heir/show"
      end
    else
      redirect_to "/index"
    end
  end

  #更新ページ
  def heir_edit
    if !!Heir.find_by(user_id: session[:id])
      if session[:id] != nil
        @heir = Heir.find_by(user_id: session[:id])
        @interest = ArtCategory.find(@heir.art_category_id)
        render :update
      else
        redirect_to "/index"
      end
    else
      redirect_to "/heir/show"
    end
  end

  #更新
  def heir_update
    if session[:id] != nil
      @heir = Heir.find_by(user_id: session[:id])
      if @heir.update_attributes(art_category_id: params[:heir][:art_category_id], introduction: params[:heir][:introduction])
        flash[:success] = "success"
        redirect_to "/heir/show"
      else
        flash[:danger] = "エラー"
        redirect_to "/heir/update"
      end
    else
    end
  end
end

private
def heir_params
  params.require(:heir).permit(:user_id, :art_category_id, :introduction)
end