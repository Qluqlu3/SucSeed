# ローカル開発用 Dockerfile
# Ruby 3.3.0 の slim イメージをベースにする（軽量版 Debian）
FROM ruby:3.3.0-slim

# ネイティブ拡張 gem のビルドや画像処理に必要な OS ライブラリをインストール
#   build-essential          … mysql2 / bcrypt などのコンパイルに必要
#   default-libmysqlclient-dev … mysql2 gem が MySQL のヘッダーを参照するため必要
#   imagemagick              … mini_magick（画像リサイズ）の実行バイナリ
#   git                      … Gemfile で github: 参照している gem があるときに必要
RUN apt-get update -qq && \
  apt-get install -y --no-install-recommends \
  build-essential \
  default-libmysqlclient-dev \
  curl \
  git \
  imagemagick && \
  rm -rf /var/lib/apt/lists/*

# Node.js 22 LTS（pnpm 11 が node:sqlite を必要とするため Node 22+ が必須）
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
  apt-get install -y --no-install-recommends nodejs && \
  rm -rf /var/lib/apt/lists/*

# pnpm v9（lockfileVersion 9.0 対応、Node 22 で動作。pnpm 11 は Docker 非対話環境でのビルドスクリプト実行に問題あり）
RUN npm install -g pnpm@9

# コンテナ内の作業ディレクトリを /app に固定
WORKDIR /app

# bundler をインストール（Gemfile.lock のバージョンに合わせる）
RUN gem install bundler

# Gemfile だけ先にコピーして bundle install する
# → アプリコードを変えても Gemfile が変わっていなければこのレイヤーはキャッシュが効く
COPY Gemfile* ./
RUN bundle install --jobs 4 --retry 3

# package.json + pnpm-lock.yaml を先にコピーして pnpm install する
# → package.json が変わっていなければこのレイヤーもキャッシュが効く
# → node_modules を Linux 用バイナリで構築する（macOS バイナリの混入を防ぐ）
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# アプリ全体をコンテナにコピー（.dockerignore で node_modules 等は除外済み）
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
