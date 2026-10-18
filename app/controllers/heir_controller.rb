class HeirController < ApplicationController
  before_action :require_login

  # 詳細情報入力振り分け
  def heir_show
    heir = own_heir

    if heir.nil?
      @page_props = {
        artCategories: art_category_options,
        errors: [],
        flash: flash.to_h,
      }
      render :heir
    else
      @page_props = {
        heir: {
          artCategoryName: heir.art_category.name,
          introduction: heir.introduction.to_s,
        },
        flash: flash.to_h,
      }
      render :show
    end
  end

  # 詳細情報入力
  def heir_create
    heir = Heir.new(heir_params.merge(user_id: Current.user_id))
    if heir.save
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
    redirect_to '/heir/show'
  end

  # 更新ページ
  def heir_edit
    heir = own_heir
    return redirect_to '/heir/show' if heir.nil?

    @page_props = {
      heir: {
        artCategoryId: heir.art_category_id,
        introduction: heir.introduction.to_s,
      },
      artCategories: art_category_options,
      errors: [],
      flash: flash.to_h,
    }
    render :update
  end

  # 更新
  def heir_update
    heir = Heir.find_by(user_id: Current.user_id)
    if heir&.update(heir_params)
      flash[:success] = t('flash.success.saved')
      redirect_to '/heir/show'
    else
      flash[:danger] = t('flash.danger.error')
      redirect_to '/heir/edit'
    end
  end

  private

  def own_heir
    Heir.includes(:art_category).find_by(user_id: Current.user_id)
  end

  def heir_params
    params.expect(heir: %i[art_category_id introduction])
  end
end
