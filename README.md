# SucSeed

伝統工芸品を作る職人（クリエイター）と後継者をマッチングするプラットフォームです。
Ruby on Rails 7.2 / MySQL 8.0 で構築。Docker で簡単にローカル起動できます。

## 技術スタック

| 種別 | 採用技術 |
|---|---|
| バックエンド | Ruby 3.3.0 / Rails 7.2 |
| フロントエンド | React 19 / TypeScript 5 |
| CSS | Tailwind CSS v4 |
| JS バンドラー | esbuild（jsbundling-rails 経由） |
| JS パッケージ管理 | pnpm 11 |
| 静的解析 | Biome（Linter + Formatter） |
| DB | MySQL 8.0 |
| 環境 | Docker / Docker Compose |

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

# 2. イメージをビルド（初回・Gemfile / package.json 変更後はこちら）
docker compose build

# 3. DB を作成してマイグレーション
docker compose run --rm web rails db:create db:migrate

# 4. 起動（Rails + esbuild + Tailwind + MySQL の 4 サービスが立ち上がる）
docker compose up
```

ブラウザで http://localhost:3000 にアクセス。

### よく使うコマンド

```sh
docker compose up                         # 起動（2回目以降）
docker compose down                       # 停止
docker compose down -v                    # DB・node_modules データごとリセット

docker compose run --rm web rails console    # Rails コンソール
docker compose run --rm web rails routes     # ルーティング確認
docker compose run --rm web rails db:migrate # マイグレーション追加後
```

### Gemfile または package.json を変更した場合

gem や npm パッケージを追加・更新したらイメージを再ビルドしてください。

```sh
docker compose build
docker compose up
```

## フロントエンド開発

### ディレクトリ構成

```
frontend/
├── application.ts          # esbuild エントリーポイント
├── components/
│   ├── mount.ts            # data-react-component 属性でコンポーネントを自動マウント
│   └── (コンポーネントをここに追加)
├── pages/
│   └── (ページ単位コンポーネントをここに追加)
└── styles/
    └── tailwind.css        # Tailwind CSS v4 エントリーポイント
```

### ERB ページに React コンポーネントを埋め込む

`data-react-component` 属性で任意の ERB ページにコンポーネントをマウントできます。

```erb
<%# props は JSON 文字列で渡す %>
<div data-react-component="MyComponent" data-props='{"title":"こんにちは"}'></div>
```

`frontend/components/mount.ts` の `COMPONENTS` にコンポーネントを登録してください。

```ts
const COMPONENTS = {
  MyComponent,  // ← 追加
};
```

### Lint / Format コマンド

ホストで直接実行します（`pnpm install` が済んでいる前提）。

```sh
pnpm run lint       # 問題をチェック（エラー表示のみ）
pnpm run lint:fix   # 問題を自動修正（lint + format）
pnpm run format     # フォーマットのみ適用
```

Biome の設定は [biome.json](biome.json) を参照してください。

### JS / CSS を手動ビルドする場合

```sh
pnpm run build       # JS（esbuild）
pnpm run build:css   # CSS（Tailwind）
```
