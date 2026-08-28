require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module SucSeed
  class Application < Rails::Application
    # Rails 8.1 のフレームワーク既定値を有効にする。7.2 からの主な変更点:
    #   8.0 - action_dispatch.strict_freshness (ETag を Last-Modified より優先)
    #       - Regexp.timeout = 1 秒 (ReDoS 対策)
    #   8.1 - production で YJIT を有効化
    #       - action_controller.escape_json_responses = false
    #         (render json: での <, >, & のユニコードエスケープをやめる。
    #          JSON は fetch で受け取るだけで HTML に直接埋め込まないため安全。
    #          ERB の data-props 側は escape_html_entities_in_json + ERB の
    #          自動エスケープが効くのでこの設定の影響を受けない)
    #       - action_controller.action_on_path_relative_redirect = :raise
    #       - active_record.raise_on_missing_required_finder_order_columns = true
    config.load_defaults 8.1

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
