# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

# アプリはesbuildが出力する同一オリジンのバンドルのみを読み込み、外部CDNやインラインscript/styleは使わない
# （フロントはReactのCSSOM経由のstyleなのでstyle-src :selfで問題ない）。
# 例外はSentry(frontend/spa/sentry.ts)のエラーレポート送信先のみ。
Rails.application.config.content_security_policy do |policy|
  policy.default_src :self
  policy.font_src    :self
  policy.img_src     :self, :data
  policy.object_src  :none
  policy.script_src  :self
  policy.style_src   :self
  policy.connect_src :self, 'https://*.ingest.sentry.io', 'https://*.ingest.us.sentry.io', 'https://*.ingest.de.sentry.io'
  policy.base_uri    :self
  policy.frame_ancestors :none
end

# Report CSP violations to a specified URI
# For further information see the following documentation:
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
# Rails.application.config.content_security_policy_report_only = true
