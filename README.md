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

# 2. イメージをビルドして起動（初回）
#    起動時に gem が不足していれば bundle install が自動で走る
docker compose up --build

# 3. DB を作成してマイグレーション（別ターミナルで）
docker compose run --rm web rails db:create db:migrate
```

ブラウザで http://localhost:3000 にアクセス。

### よく使うコマンド

```sh
docker compose up                              # 起動（2回目以降）
docker compose down                            # 停止
docker compose run --rm web rails console      # Rails コンソール
docker compose run --rm web rails routes       # ルーティング確認
docker compose run --rm web rails db:migrate   # マイグレーション追加後
```

### Gemfile を変更した場合

`docker compose up` で起動すると `entrypoint.sh` が `bundle check` を実行し、
不足 gem があれば自動で `bundle install` します。手動操作は不要です。

```sh
docker compose up
```

### package.json を変更した場合

```sh
docker compose up --build   # イメージを再ビルド（pnpm install が走る）
```

### トラブルシューティング

**`Could not find <gem名> in locally installed gems` が出る**

`bundle_cache` ボリュームが空か古い状態です。`docker compose up` を再実行すると
`entrypoint.sh` が自動で `bundle install` を走らせます。それでも解決しない場合：

```sh
docker compose run --rm web bundle install
docker compose up
```

**すべてをリセットしたい（DB データは残す）**

```sh
docker compose down
docker volume rm sucseed_bundle_cache
docker compose up --build
```

**DB データも含めて完全リセット**

```sh
docker compose down -v
docker compose up --build
docker compose run --rm web rails db:create db:migrate
```

---

## フロントエンド開発

### ディレクトリ構成

```
frontend/
├── application.ts          # esbuild エントリーポイント
├── pages.ts                # 画面 id とページコンポーネントの登録表
├── components/
│   ├── mountPage.tsx       # 全ページ共通のマウントロジック
│   ├── ErrorBoundary/
│   ├── CreatorCard/        # 複数ページで共用する共通コンポーネント
│   ├── FlashMessages/
│   ├── IndexPage/          # ページごとに 1 ディレクトリ
│   │   ├── IndexPage.tsx       # コンポーネント本体
│   │   └── index.ts            # re-export
│   └── ...
├── spa/                    # Navbar・LoginModal など全ページ共通の island
├── three/                  # Three.js 3D ビューワー
├── utils/                  # csrf.ts / postJson.ts など汎用ユーティリティ
└── styles/
    ├── tailwind.css        # Tailwind CSS v4 エントリーポイント
    └── fontawesome.css
```

### ERB ページに React コンポーネントを埋め込む

**1. テンプレートで `react_root` を呼ぶ**

```erb
<%= react_root 'my-page', @page_props %>
```

`@page_props` は JSON にして `data-props` 属性に入ります（エスケープはヘルパーが行うので、
JSON を手で ERB に埋め込まないこと）。props を取らない画面は `react_root 'my-page'` だけでよい。

**2. `frontend/pages.ts` に1行足す**

```ts
import { MyPage } from './components/MyPage';

mountPage('my-page', MyPage);
```

`mountPage` は `data-props` の JSON をパースしてコンポーネントの props として渡します。

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

### Next.js への移行（web/）

画面を Rails の ERB + React から Next.js（`web/`）へ1画面ずつ移している途中です。
ブラウザが見るのは Next の1オリジンだけで、Next にまだ無い画面と `/api/*` は
[web/next.config.ts](web/next.config.ts) の `rewrites` で Rails に中継します。
同一オリジンなので、ログインのセッション Cookie と CSRF トークンは今のまま使えます。

開発時の入口は Next（http://localhost:3000）で、Rails は 3001 番で動きます。
`docker compose up` でも `bin/dev` でも同じ構成になります。中継を通さずに Rails を直接見たいときは
http://localhost:3001 を開きます（docker compose では Next の中継先は `RAILS_ORIGIN=http://web:3001`）。

```sh
pnpm --filter sucseed-web typecheck
pnpm --filter sucseed-web build
```
