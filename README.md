# SucSeed

伝統工芸品を作る職人（クリエイター）と後継者をマッチングするプラットフォームです。
Ruby on Rails 6.1 / MySQL 8.0 で構築。Docker で簡単にローカル起動できます。

## 機能

- ユーザー登録・ログイン（メール認証付き）
- クリエイター / 後継者プロフィール
- 日記・ギャラリー投稿（いいね・コメント）
- マッチング（アピール・スカウト）
- フォロー / メッセージ
- 管理画面

## ローカル起動手順

### 必要なもの

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 手順

```sh
# 1. リポジトリをクローン
git clone git@github.com:Qluqlu3/SucSeed.git
cd SucSeed

# 2. 環境変数ファイルを作成（内容はデフォルトのままで OK）
cp .env.example .env

# 3. イメージをビルド（初回・Gemfile 変更後）
docker compose build

# 4. DB を作成してマイグレーション
docker compose run --rm web rails db:create db:migrate

# 5. 起動
docker compose up
```

ブラウザで http://localhost:3000 にアクセス。

### よく使うコマンド

```sh
docker compose up           # 起動（2回目以降）
docker compose down         # 停止
docker compose down -v      # DB データごとリセット

docker compose run --rm web rails console   # Rails コンソール
docker compose run --rm web rails routes    # ルーティング確認
```

### Gemfile を変更した場合

```sh
docker compose build
docker compose up
```
