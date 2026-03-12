# ローカル開発用 Dockerfile
# Ruby 3.3.0 の slim イメージをベースにする（軽量版 Debian）
FROM ruby:3.3.0-slim

# ネイティブ拡張 gem のビルドや画像処理に必要な OS ライブラリをインストール
#   build-essential          … mysql2 / bcrypt などのコンパイルに必要
#   default-libmysqlclient-dev … mysql2 gem が MySQL のヘッダーを参照するため必要
#   nodejs                   … Sprockets が JS を処理するときに使う実行環境
#   imagemagick              … mini_magick（画像リサイズ）の実行バイナリ
#   git                      … Gemfile で github: 参照している gem があるときに必要
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      default-libmysqlclient-dev \
      nodejs \
      npm \
      git \
      imagemagick && \
    rm -rf /var/lib/apt/lists/*

# コンテナ内の作業ディレクトリを /app に固定
WORKDIR /app

# bundler をインストール（Gemfile.lock のバージョンに合わせる）
RUN gem install bundler

# Gemfile だけ先にコピーして bundle install する
# → アプリコードを変えても Gemfile が変わっていなければこのレイヤーはキャッシュが効く
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4 --retry 3

# アプリ全体をコンテナにコピー（.dockerignore で不要ファイルは除外済み）
COPY . .

# Puma が待ち受けるポート番号を宣言（docker-compose.yml の ports と合わせる）
EXPOSE 3000

# 起動前に古い server.pid を削除するエントリーポイントを設定
# → コンテナが異常終了した後でも「A server is already running」にならない
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# デフォルト起動コマンド（docker-compose.yml の command で上書きされる）
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]

# ── デプロイ時のメモ（今は使わない）────────────────────────
# 本番ビルド時はアセットをプリコンパイルしておく必要がある
#   RUN bundle exec rails assets:precompile
# マルチステージビルドにすると本番イメージをさらに軽量にできる
# ──────────────────────────────────────────────────────────
