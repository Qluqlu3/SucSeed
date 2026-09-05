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

    # 本アプリは Active Storage を使わず、画像アップロードは CarrierWave + MiniMagick
    # で行っている。config/storage.yml は eager_load 時の初期化エラーを避けるためだけに
    # 置いてあるダミー設定であり、実際に variant(画像加工)を使うことはない。
    #
    # にもかかわらず、Rails 8.1 の load_defaults は active_storage.variant_processor を
    # 既定で :vips に変更した。ActiveStorage::Engine は起動時にこの設定に基づいて
    # ActiveStorage::Transformers::Vips を読み込もうとし、そこで image_processing gem の
    # vips バックエンドを require する。ruby-vips (libvips のバインディング) を
    # インストールしていないため本来は LoadError を握りつぶして警告ログに留める設計だが、
    # image_processing 2.x でエラーメッセージの文言が変わった結果、Rails 側の
    # rescue の正規表現(/libvips/ / /image_processing/)にマッチしなくなり、
    # 例外がそのまま再送出されてアプリの起動自体が失敗するようになっていた
    # (image_processing 1.14 -> 2.1 へのアップデートで顕在化。bundle update pagy 等の
    # 副作用でロックされた)。
    #
    # 使っていない機能のために存在しない依存(libvips)を追加するのではなく、
    # variant_processor 自体を明示的に無効化して読み込みを止めるのが正しい対応。
    config.active_storage.variant_processor = :disabled

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
