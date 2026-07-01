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

gem を追加・更新したあとは、**イメージの再ビルドだけでは不十分**です。  
gem は `bundle_cache` という名前付きボリュームに永続化されており、起動時にコンテナの `/usr/local/bundle` をマウントで上書きします。ボリューム内を直接更新する必要があります。

```sh
docker compose run --rm web bundle install   # ボリューム内の gem を更新
docker compose up
```

### package.json を変更した場合

```sh
docker compose up --build   # イメージを再ビルド（pnpm install が走る）
```

### トラブルシューティング

**`Could not find <gem名> in locally installed gems` が出る**

Gemfile.lock が更新されたがボリューム内の gem が古い状態です。

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
├── components/
│   ├── mountPage.tsx       # 全ページ共通のマウントロジック
│   ├── ErrorBoundary/
│   ├── CreatorCard/        # 複数ページで共用する共通コンポーネント
│   ├── FlashMessages/
│   ├── IndexPage/          # ページごとに 1 ディレクトリ
│   │   ├── IndexPage.tsx       # コンポーネント本体
│   │   ├── index.ts            # re-export
│   │   └── mountIndexPage.tsx  # このページ専用のマウント処理
│   └── ...
├── spa/                    # Navbar・LoginModal など全ページ共通の island
├── three/                  # Three.js 3D ビューワー
├── utils/                  # csrf.ts / postJson.ts など汎用ユーティリティ
└── styles/
    ├── tailwind.css        # Tailwind CSS v4 エントリーポイント
    └── fontawesome.css
```

### ERB ページに React コンポーネントを埋め込む

**1. ERB に `id` と `data-props` を持つ div を置く**

```erb
<div id="my-page" data-props="<%= @page_props.to_json %>"></div>
```

**2. `mountMyPage.tsx` でマウントする**

```tsx
import { mountPage } from '../mountPage';
import { MyPage } from './MyPage';

mountPage('my-page', MyPage, { /* fallback props */ });
```

`mountPage` は `data-props` の JSON を自動でパースしてコンポーネントに渡します。

**3. `application.ts` に import を追加する**

```ts
import '../components/MyPage/mountMyPage';
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
