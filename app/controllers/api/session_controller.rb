module Api
  class SessionController < ApplicationController
    def show
      role = if session[:creator]
        'creator'
      elsif session[:id] && Heir.find_by(user_id: session[:id])
        'heir'
      elsif session[:id]
        'user'
      else
        'guest'
      end

      render json: {
        loggedIn: session[:id].present?,
        userId: session[:id],
        role: role,
        csrfToken: form_authenticity_token,
        layoutAssets: {
          logoSrc: helpers.image_path('logo.png'),
          titleSrc: helpers.image_path('title.png')
        },
        artCategories: ArtCategory.order(:id).pluck(:id, :name).map do |id, name|
          { id: id, name: name }
        end
      }
    end
  end
end
