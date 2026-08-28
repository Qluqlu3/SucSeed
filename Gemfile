source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.11'

# Rails 7.2 は 2026-08-09 にサポート終了(EOL)したため 8.1 系へ移行。
# 8.1 は Ruby >= 3.2 を要求する(本アプリは 3.3.11)。
gem 'rails', '~> 8.1', '>= 8.1.3.1'
# Use mysql as the database for Active Record
gem 'mysql2', '>= 0.5.0', '< 0.6.0'
# Use Puma as the app server
# 8.0.2 以上: PROXY プロトコルヘッダのインジェクション/なりすまし修正版を含む。
# 8.0 の破壊的変更は「production の既定 bind が 0.0.0.0 から :: へ」の1点のみ。
# 本アプリは Docker の CMD で -b 0.0.0.0 を明示しているため影響しない。
gem 'puma', '~> 8.0', '>= 8.0.2'
# uglifier は ExecJS(Node.js)が必要で環境依存が強い。Rails 7 では不要
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# gem 'nokogiri', '1.10.9'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

# ブルートフォース・DoS 対策
gem 'rack-attack'

# エラー監視
gem 'sentry-rails'
gem 'sentry-ruby'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'bundler-audit', '>= 0.9.0'
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  # Railsアプリの静的セキュリティ解析（Mass Assignment, SQLi, XSS等の脆弱性検査）
  gem 'brakeman', require: false
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  # listen: < 3.2 の上限はRails 6 リリース当初のもので古すぎる。
  # spring-watcher-listen はこの古い上限に依存しているため一緒に削除。
  # Docker 環境では spring はほぼ不要だが spring.rb が存在するので gem は残す。
  gem 'listen', '~> 3.8'
  gem 'web-console', '>= 3.3.0'

  gem 'rubocop', require: false
  gem 'rubocop-performance', require: false
  gem 'rubocop-rails', require: false

  gem 'better_errors', '>= 2.5.0'
  gem 'binding_of_caller', '>= 0.8.0'
  gem 'guard-livereload', '>= 2.5.2'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'net-imap', '>= 0.6.4.1'
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

# rails-i18n は Rails のメジャーバージョンに追随する(7.x は railties < 8 制約)
gem 'rails-i18n', '~> 8.0'

# 暗号化
gem 'bcrypt', '>= 3.1.22'

# 画像アップロード
gem 'addressable', '>= 2.9.0'
gem 'carrierwave', '>= 3.1.3'
gem 'mini_magick', '>= 4.8.0'

# アセットパイプライン（Sprockets）
# stylesheet_link_tag / javascript_include_tag が /assets/... を生成するために必要
gem 'sprockets-rails'

# jsbundling-rails: esbuild/rollup/webpack などを Rails と繋ぐ公式 gem
# esbuild でバンドルした JS を app/assets/builds/ に出力し
# Sprockets がそれを通常のアセットとして扱えるようにする
gem 'jsbundling-rails'

# タグ
gem 'acts-as-taggable-on', '~> 13.0'

# ページネーション(JSON propsにpage/pages/countを渡すだけなので軽量なPagyを採用)
gem 'pagy', '~> 9.0'

# JSON シリアライズ
# 各コントローラで手書きしていた camelCase ハッシュを app/serializers に集約する。
# ActiveModelSerializers はメンテナンス停止しているため、後継として活発な Alba を採用。
# 依存 gem を持たず、キー変換(lower_camel)を宣言的に書けるのが選定理由。
gem 'alba', '~> 3.11'

# trigram は app/ 内で未使用かつ2012年以降メンテされていないため削除
