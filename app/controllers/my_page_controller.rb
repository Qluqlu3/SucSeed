class MyPageController < ApplicationController
  def my_page
    if session[:id] == nil
      flash.now[:danger] = "ログインしてください"
      redirect_to "/index"
    elsif session[:creator] != nil
      if !Creator.find_by(user_id: session[:id])
        @created = 1
      else
        @created = 0
      end
    else
      if !Heir.find_by(user_id: session[:id])
        @created = 1
      else
        @created = 0
      end
    end
    @user = User.find(session[:id])
  end

  def show
    if session[:id] != nil
      @user = User.find(session[:id])
      render :update
    else
      redirect_to "/index"
    end
  end

  # アップデート実行
  def update
    @user = User.find(session[:id])
    # :name => params[:user][:name], :email => params[:user][:email], :phone_number => params[:user][:phone_number], :postal_code => params[:user][:postal_code], :address_1 => params[:user][:address_1], :address_2 => params[:user][:address_2], :profile => params[:user][:profile]
    if @user.update_attributes(:avatar_path => params[:user][:avatar_path], :name => params[:user][:name], :email => params[:user][:email],  :profile => params[:user][:profile])
      flash[:success] = "success"
      redirect_to "/my_page/my_page"
    else
      flash.now[:danger] = "エラー"
      render :show
    end
  end
end
