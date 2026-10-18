class CreatorController < ApplicationController
  before_action :require_login
  before_action :require_creator, only: %i[edit update]

  def show
    creator = own_creator
    if Current.creator? && creator.nil?
      @page_props = {
        artCategories: art_category_options,
        errors: [],
        flash: flash.to_h,
      }
      render :create
    else
      return redirect_to '/index' unless creator

      @page_props = {
        creator: {
          title: creator.title,
          categoryName: creator.art_category.name,
          establishment: creator.establishment,
          employee: creator.employee,
          postalCode: creator.postal_code,
          isRecruitment: creator.is_recruitment,
        },
        isCreator: Current.creator?,
        flash: flash.to_h,
      }
      render :show
    end
  end

  def edit
    creator = own_creator
    return redirect_to '/creator/show' unless creator

    @page_props = {
      creator: {
        title: creator.title,
        artCategoryId: creator.art_category_id,
        categoryName: creator.art_category.name,
        establishment: creator.establishment,
        employee: creator.employee,
        postalCode: creator.postal_code,
        isRecruitment: creator.is_recruitment,
      },
      artCategories: art_category_options,
      isCreator: Current.creator?,
      errors: [],
      flash: flash.to_h,
    }
    render :update
  end

  def create
    creator = Creator.new(creator_params.merge(user_id: Current.user_id))
    if creator.save
      flash[:success] = t('flash.success.saved')
      redirect_to '/creator/show'
    else
      @page_props = {
        artCategories: art_category_options,
        errors: creator.errors.full_messages,
        flash: flash.to_h,
      }
      render :create
    end
  end

  def update
    creator = Creator.find_by(user_id: Current.user_id)
    if creator&.update(creator_update_params)
      flash[:success] = t('flash.success.saved')
      redirect_to '/creator/show'
    else
      flash[:danger] = t('flash.danger.error')
      redirect_to '/creator/edit'
    end
  end

  private

  def own_creator
    Creator.includes(:art_category).find_by(user_id: Current.user_id)
  end

  def creator_params
    params.expect(creator: %i[title art_category_id establishment employee postal_code
                              is_recruitment])
  end

  # 更新フォームは art_category というキーで送ってくる（登録フォームは creator）
  def creator_update_params
    params.expect(art_category: %i[title art_category_id establishment employee postal_code
                                   is_recruitment])
  end
end
