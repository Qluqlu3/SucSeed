source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.0'

# Rails 7.2.3.1 以上: Active Storage の DoS 脆弱性修正版を含む
gem 'rails', '~> 7.2', '>= 7.2.3.1'
# Use mysql as the database for Active Record
gem 'mysql2', '>= 0.4.4', '< 0.6.0'
# Use Puma as the app server
# 3.x は Ruby 3.x 系で動作しないため 6.x に上げる
gem 'puma', '~> 8.0'
# sass-rails 5.x は sprockets 4 / Rails 7 と非互換。sassc-rails は drop-in 代替
gem 'sassc-rails'
# uglifier は ExecJS(Node.js)が必要で環境依存が強い。Rails 7 では不要
# CoffeeScript ファイル (.coffee) がまだ残っているため coffee-rails は維持
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
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

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  # listen: < 3.2 の上限はRails 6 リリース当初のもので古すぎる。
  # spring-watcher-listen はこの古い上限に依存しているため一緒に削除。
  # Docker 環境では spring はほぼ不要だが spring.rb が存在するので gem は残す。
  gem 'listen', '~> 3.8'
  gem 'web-console', '>= 3.3.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  # chromedriver-helper は2019年に廃止。webdrivers が後継
  gem 'webdrivers'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

# bootstrap
gem 'bootstrap', '~> 4.6.2'
gem 'jquery-rails', '>= 4.4.0'

# rails-i18n 7.x が Rails 7.1 対応版
gem 'rails-i18n', '~> 7.0'

# 暗号化
gem 'bcrypt', '>= 3.1.22'

# 画像アップロード
gem 'addressable', '>= 2.9.0'
gem 'carrierwave', '>= 1.2.3'
gem 'mini_magick', '>= 4.8.0'

# jsbundling-rails: esbuild/rollup/webpack などを Rails と繋ぐ公式 gem
# esbuild でバンドルした JS を app/assets/builds/ に出力し
# Sprockets がそれを通常のアセットとして扱えるようにする
gem 'jsbundling-rails'

# タグ
gem 'acts-as-taggable-on', '>= 6.0.0'

gem 'guard-livereload', '>= 2.5.2'

gem 'better_errors', '>= 2.5.0'

gem 'activeadmin', '>= 1.3.1'

# font-awesome-sass 5.x は旧 Ruby Sass gem に依存→廃止済み。6.x で sassc 対応
gem 'font-awesome-sass', '~> 6.0'

gem 'binding_of_caller', '>= 0.8.0'

# trigram は app/ 内で未使用かつ2012年以降メンテされていないため削除
