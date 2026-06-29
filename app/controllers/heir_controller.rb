class HeirController < ApplicationController
  before_action :require_login, except: [:heir_show]

  # 詳細情報入力振り分け
  def heir_show
    if session[:id].present? && !Heir.find_by(user_id: session[:id])
      @heir = Heir.new
      @art_categories = ArtCategory.all
      @page_props = {
        artCategories: @art_categories.map { |c| { id: c.id, name: c.name } },
        errors: @heir.errors.full_messages,
        flash: flash.to_h
      }
      render :heir
    elsif session[:id].nil?
      redirect_to '/index'
    else
      @heir = Heir.find_by(user_id: session[:id])
      @interest = ArtCategory.find(@heir.art_category_id)
      @page_props = {
        heir: {
          artCategoryName: @interest.name,
          introduction: @heir.introduction.to_s
        },
        flash: flash.to_h
      }
      render :show
    end
  end

  # 詳細情報入力
  def heir_create
    @heir = Heir.new(heir_params.merge(user_id: session[:id]))
    if @heir.save
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to '/heir/show'
  end

  # 更新ページ
  def heir_edit
    if Heir.find_by(user_id: session[:id])
      @heir = Heir.find_by(user_id: session[:id])
      @art_categories = ArtCategory.all
      @page_props = {
        heir: {
          artCategoryId: @heir.art_category_id,
          introduction: @heir.introduction.to_s
        },
        artCategories: @art_categories.map { |c| { id: c.id, name: c.name } },
        errors: [],
        flash: flash.to_h
      }
      render :update
    else
      redirect_to '/heir/show'
    end
  end

  # 更新
  def heir_update
    @heir = Heir.find_by(user_id: session[:id])
    if @heir.update(art_category_id: params[:heir][:art_category_id], introduction: params[:heir][:introduction])
      flash[:success] = t('flash.success.saved')
      redirect_to '/heir/show'
    else
      flash[:danger] = t('flash.danger.error')
      redirect_to '/heir/update'
    end
  end

  private

  def heir_params
    params.require(:heir).permit(:art_category_id, :introduction)
  end
end
