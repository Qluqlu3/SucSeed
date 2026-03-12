# ────────────────────────────────────────────
# ベースイメージ
#   ruby:3.3.0-slim … Debian slim ベースの公式Ruby イメージ
#   slim を使うことでイメージサイズを削減しつつ必要ライブラリは apt で追加
# ────────────────────────────────────────────
FROM ruby:3.3.0-slim

# ────────────────────────────────────────────
# OS パッケージインストール
#   build-essential … native extension ビルドに必要 (mysql2, bcrypt 等)
#   default-libmysqlclient-dev … mysql2 gem のコンパイルに必要
#   nodejs / npm … Sprockets が ExecJS でJSを処理するために必要
#   curl / gnupg … Node.js リポジトリ追加に使用
#   git … Gemfile の github: 参照解決に使う場合に必要
#   imagemagick … mini_magick (画像リサイズ) の実行バイナリ
# ────────────────────────────────────────────
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      default-libmysqlclient-dev \
      nodejs \
      npm \
      curl \
      gnupg \
      git \
      imagemagick && \
    rm -rf /var/lib/apt/lists/*

# ────────────────────────────────────────────
# 作業ディレクトリ設定
#   コンテナ内の /app にアプリを配置する
# ────────────────────────────────────────────
WORKDIR /app

# ────────────────────────────────────────────
# Bundler バージョン固定
#   Gemfile.lock に記録されているバージョンに揃えることでCI/本番と一致させる
# ────────────────────────────────────────────
RUN gem install bundler

# ────────────────────────────────────────────
# Gem インストール（レイヤーキャッシュ最適化）
#   Gemfile / Gemfile.lock のみを先にコピーすることで
#   アプリコード変更時に bundle install を再実行しなくて済む
# ────────────────────────────────────────────
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4 --retry 3

# ────────────────────────────────────────────
# アプリ全体をコンテナへコピー
#   .dockerignore に不要ファイルを列挙しているのでそちらも参照
# ────────────────────────────────────────────
COPY . .

# ────────────────────────────────────────────
# アセットプリコンパイル（開発環境では任意だが記載しておく）
#   本番デプロイ時は docker build --build-arg RAILS_ENV=production
#   でここが実行されキャッシュバスト後に自動実行される
# ────────────────────────────────────────────
# RUN bundle exec rails assets:precompile

# ────────────────────────────────────────────
# ポート公開
#   Puma はデフォルト 3000 番で待ち受ける
# ────────────────────────────────────────────
EXPOSE 3000

# ────────────────────────────────────────────
# エントリーポイント
#   コンテナ起動のたびに entrypoint.sh を実行する
#   server.pid が残っていると Rails が起動しないので削除してから起動する
# ────────────────────────────────────────────
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# デフォルトの起動コマンド (docker-compose.yml の command で上書き可能)
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
