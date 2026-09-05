Sentry.init do |config|
  config.dsn = ENV.fetch('SENTRY_DSN', nil)
  config.enabled_environments = %w[production]
  config.breadcrumbs_logger = %i[active_support_logger http_logger]
  config.traces_sample_rate = 0.1
  config.send_default_pii = false

  # sentry-ruby 7.0 で Structured Logging (Rails の ActionController/ActiveRecord/
  # ActiveJob 等のログをSentry Logsとして自動送信する新機能)が既定で有効になった。
  # エラートラッキングだけを目的として導入しているため、余分なイベント送信を
  # 増やさないよう明示的に無効化する。
  #
  # 同時に追加された Metrics 機能は Sentry.metrics.* を呼ばない限り何も送信されず、
  # かつ config オブジェクトに有効/無効を切り替えるアクセサ自体が存在しないため
  # (7.0.0時点でconfig.metricsのようなAPIは無い)、対応不要。
  config.rails.structured_logging.enabled = false
end
