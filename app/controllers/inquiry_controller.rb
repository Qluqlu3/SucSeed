class InquiryController < ApplicationController
  def input_page
    @inquiry = Inquiry.new
    @categories = InquiryCategory.all
    render :'inquiry/input_page'
  end

  def send_inquiry
    if session[:id] != nil
      params[:inquiry][:user_id] = session[:id]
    else
      params[:inquiry][:user_id] = nil
    end
    @inquiry = Inquiry.new(inquiry_params)
    if @inquiry.save
      flash[:success] = "お問い合わせありがとうございます"
      redirect_to "/inquiry/input"
    else
      @categories = InquiryCategory.all
      render action: :input_page
    end
  end
end

private
def inquiry_params
  params.require(:inquiry).permit(:user_id, :inquiry_category_id, :content)
end