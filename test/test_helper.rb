ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

# テスト用に BCrypt コストを最小化して高速化
BCrypt::Engine.cost = BCrypt::Engine::MIN_COST

module ActiveSupport
  class TestCase
    fixtures :all

    # ログイン済みセッションを作るヘルパー
    def log_in_as(user, password: 'password123')
      post '/user/login', params: { session: { email: user.email, password: password } }
    end
  end
end
