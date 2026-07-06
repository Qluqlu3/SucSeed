require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module SucSeed
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.2

    # Ruby 3.3.0 の YJIT には mail gem の生成パーサ（message_ids_parser 等）で
    # セグフォルトを起こすバグがあるため無効化する。
    config.yjit = false

    config.middleware.use Rack::Attack

    config.active_record.default_timezone = :local
    config.time_zone = 'Tokyo'

    config.i18n.default_locale = :ja # デフォルトのlocaleを日本語(:ja)にする

    config.i18n.load_path += Dir[Rails.root.join('config/locales/**/*.{rb,yml}').to_s]

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
  end
end
