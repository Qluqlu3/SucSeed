class InquiryController < ApplicationController
  def input_page
    @inquiry = Inquiry.new
    @page_props = {
      categories: category_props,
      errors: [],
      prevValues: { inquiryCategoryId: '', content: '' },
      flash: flash.to_h,
    }
    render :input_page
  end

  def send_inquiry
    @inquiry = Inquiry.new(inquiry_params.merge(user_id: Current.user_id))
    if @inquiry.save
      flash[:success] = t('flash.success.inquiry_sent')
      redirect_to '/inquiry/input'
    else
      @page_props = {
        categories: category_props,
        errors: @inquiry.errors.full_messages,
        prevValues: {
          inquiryCategoryId: @inquiry.inquiry_category_id || '',
          content: @inquiry.content.to_s,
        },
        flash: flash.to_h,
      }
      render :input_page
    end
  end

  private

  def category_props
    InquiryCategory.order(:id).map { |c| { id: c.id, name: c.name } }
  end

  def inquiry_params
    params.require(:inquiry).permit(:inquiry_category_id, :content)
  end
end
