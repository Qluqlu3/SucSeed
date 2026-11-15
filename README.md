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
│   ├── CreatorCard/        # 複数ページで共用する共通コンポーネント
│   ├── IndexPage/          # ページごとに 1 ディレクトリ
│   │   ├── IndexPage.tsx       # コンポーネント本体
│   │   └── index.ts            # re-export
│   └── ...
├── spa/                    # Navbar・LoginModal などを Rails のレイアウトに island としてマウントする
└── styles/
    ├── tailwind.css        # Tailwind CSS v4 エントリーポイント
    └── fontawesome.css

packages/
├── api/                    # @sucseed/api: /api/v1 の型（types.ts）とクライアント（client.ts / index.ts）。
│                           # frontend/ と web/ の両方から import { api } from '@sucseed/api' で使う
└── ui/                     # @sucseed/ui: frontend/ と web/ で共用する UI 部品
    ├── layout/             #   Navbar・Footer・LoginModal とセッション取得
    ├── components/         #   FlashMessages・PendingFlash・ErrorBoundary・MatchUserList・PostForm・DiaryCard・
    │                       #   CreatorProfileTabs・GalleryCard・GalleryUploadForm・SelectedGalleryPage
    ├── three/              #   Three.js の 3D ビューワー（作品詳細から遅延読み込みする）
    ├── flash.ts            #   画面をまたぐ1回だけのメッセージ（ブラウザ側の flash）
    └── styles/sucseed.css  #   Tailwind のテーマとプロジェクト固有のスタイル（両方の Tailwind が読み込む）
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

API の呼び出しは `frontend/` と同じ `@sucseed/api` を使います。Next の画面には Rails の
`csrf-token` meta タグが無いため、更新系を呼ぶ前に `refreshSession()` で CSRF トークンを取得しておきます
（レイアウトが起動時に行うので、画面からは気にしなくてよい）。

移した画面の書き方（例: [web/app/match/matching/list/page.tsx](web/app/match/matching/list/page.tsx)）:

- **レイアウト**: [web/app/AppShell.tsx](web/app/AppShell.tsx) が Rails と同じ Navbar・Footer・ログインモーダルを
  `@sucseed/ui` から出す。スタイルも Rails と同じ `@sucseed/ui/styles.css` を読み込む
- **ログイン必須**: 画面で `useRequireLogin()`（[web/lib/session.tsx](web/lib/session.tsx)）を呼ぶ。
  未ログインならトップへ移し「ログインしてください」を出す。API が 401 を返したときは `redirectToLogin()`。
  職人だけ・後継者だけの画面は `useRequireRole(isCreator)` / `useRequireRole(isNonCreator)`
  （ロールが合わなければ Rails と同じくメッセージ無しでトップへ）
- **アピール/スカウト/マッチングの一覧**: 全件取得と相手ユーザーへの変換は
  [web/lib/matches.ts](web/lib/matches.ts)（`useAllMatches`・`toPartnerCard`）にまとめてある
- **一覧の全件取得**: Rails の画面は一覧を全件出していたので、API の全ページを読む
  `fetchAllPages()` / フックの `useAllPages()`（[web/lib/pagination.ts](web/lib/pagination.ts)）を使う
- **自分と相手の情報**: ログイン中の自分は `useCurrentUser()`、:id の人の名前などは `usePublicUser()`
  （[web/lib/users.ts](web/lib/users.ts)）
- **クエリ付きの画面**: `useSearchParams()` を使う部分は `<Suspense>` の内側に置く（Next のビルドが求める）。
  例: [web/app/gallery/user/search/tag/[id]/page.tsx](web/app/gallery/user/search/tag/[id]/page.tsx)
- **404**: API が `not_found` を返したら `next/navigation` の `notFound()` を呼ぶ。
  [web/app/not-found.tsx](web/app/not-found.tsx) が Rails と同じエラー画面を出す
- **画像**: アップロード画像は Rails から中継して配るので `next/image` を使わず `<img>` にし、
  Biome の `noImgElement` は理由を書いて抑止する
- **flash**: Rails の flash は Next から読み書きできないので、遷移先に伝えるメッセージは
  `pushFlash()`（`@sucseed/ui`）で積む。遷移先が Next でも Rails でも、`PendingFlash` が1回だけ出す
- **Rails 側の画面は残す**: 本番はまだ Rails だけで配信しているため、移した画面の Rails 側
  （コントローラ・テンプレート・`frontend/` のコンポーネント）は段階4で撤去するまで消さない。
  開発時は Next のページが優先され、Rails 側には届かない

```sh
pnpm --filter sucseed-web typecheck
pnpm --filter sucseed-web build
```
