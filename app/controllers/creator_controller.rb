class CreatorController < ApplicationController
  before_action :require_login
  before_action :require_creator, only: %i[edit update]

  def show
    if Current.creator? && Creator.find_by(user_id: Current.user_id).nil?
      @creator = Creator.new
      @art_categories = ArtCategory.all
      @page_props = {
        artCategories: art_category_props,
        errors: [],
        flash: flash.to_h,
      }
      render :create
    else
      @creator = User.joins(:creator).select('users.*, creators.*').find_by(creators: { user_id: Current.user_id })
      return redirect_to '/index' unless @creator

      @category = ArtCategory.find(@creator.art_category_id)
      @page_props = {
        creator: {
          title: @creator.title,
          categoryName: @category.name,
          establishment: @creator.establishment,
          employee: @creator.employee,
          postalCode: @creator.postal_code,
          isRecruitment: @creator.is_recruitment,
        },
        isCreator: Current.creator?,
        flash: flash.to_h,
      }
      render :show
    end
  end

  def edit
    @creator = ArtCategory.joins(:creators).select('creators.*, art_categories.name').find_by(creators: { user_id: Current.user_id })
    return redirect_to '/creator/show' unless @creator

    @art_categories = ArtCategory.all
    @page_props = {
      creator: {
        title: @creator.title,
        artCategoryId: @creator.art_category_id,
        categoryName: @creator.name,
        establishment: @creator.establishment,
        employee: @creator.employee,
        postalCode: @creator.postal_code,
        isRecruitment: @creator.is_recruitment == 1,
      },
      artCategories: art_category_props,
      isCreator: Current.creator?,
      errors: [],
      flash: flash.to_h,
    }
    render :update
  end

  def create
    @art_categories = ArtCategory.all
    @creator = Creator.new(creator_params.merge(user_id: Current.user_id))
    if @creator.save
      flash[:success] = t('flash.success.saved')
      redirect_to '/creator/show'
    else
      @page_props = {
        artCategories: art_category_props,
        errors: @creator.errors.full_messages,
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

  def art_category_props
    ArtCategory.order(:id).map { |c| { id: c.id, name: c.name } }
  end

  def creator_params
    params.require(:creator).permit(:title, :art_category_id, :establishment, :employee, :postal_code, :is_recruitment)
  end

  # 更新フォームは art_category というキーで送ってくる（登録フォームは creator）
  def creator_update_params
    params.require(:art_category).permit(:title, :art_category_id, :establishment, :employee, :postal_code, :is_recruitment)
  end
end
