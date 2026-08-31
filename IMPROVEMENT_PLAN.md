# SucSeed 改善計画

過去の改修（IMPROVEMENT_PLAN_2.md / REFACTORING_CHECKLIST.md / SCSS_TO_TAILWIND_PLAN.md）はすべて完了済み。
このファイルは **次に取り組む課題** の一覧。優先度順。

---

## 優先度マップ

| 優先度 | 項目 | ファイル / 対象 | 工数 | 状態 |
|:------:|------|----------------|:----:|:----:|
| 🟡 中 | Sprockets → Propshaft 移行 | アセットパイプライン | M | 未着手 |
| 🟡 中 | 本番の `cache_store` を明示する | `config/environments/production.rb` | S | 未着手 |
| 🟢 低 | HTML のフィードもページネーションする | 日記/ギャラリーの各ページ | M | 未着手 |
| 🟢 低 | Three.js 遅延読み込み（Propshaft 移行とセット） | `frontend/` | M | 未着手 |
| 🟢 低 | `to_json` → `json_escape` 明示化 | 全 ERB ビュー (45 ファイル) | S | 未着手 |
| 🟢 低 | フロントから未使用になった HTML 投稿ルートの整理 | `config/routes.rb` | S | 未着手 |

工数: S = 30分以内 / M = 半日程度 / L = 複数日

---

## 詳細

### 🟡-1　Sprockets → Propshaft 移行

**現状**: Rails 8.1 だがアセットパイプラインは Sprockets のまま
（`sprockets-rails` + `jsbundling-rails`）。Rails 8 の新規アプリ既定は Propshaft。

Propshaft はダイジェスト付与だけを行い、esbuild が出力したファイルに
二重フィンガープリントを付けない。これは下の Three.js 遅延読み込みが
できなかった直接の原因でもある。

**確認すること**:

- `app/assets/config/manifest.js` の廃止と `config.assets.paths` の再設定
- `stylesheet_link_tag` / `javascript_include_tag` の解決先
- CarrierWave の `default_url`（`/assets/default.png`）が解決できること

---

### 🟡-2　本番の `cache_store` を明示する

**現状**: `config/environments/production.rb` の `cache_store` はコメントアウトされたままで、
Rails の既定（`:file_store` = `tmp/cache`）に落ちている。

`Rails.cache` は次の2つのレート制限のカウンタ置き場になっている。

- `Rack::Attack`（IP 単位）
- Rails 8 の `rate_limit`（ユーザー単位、[docs/API.md](docs/API.md) 参照）

`:file_store` はプロセスローカルなので、**複数プロセス・複数インスタンスで動かすと
インスタンスごとに別カウントになり、実効上限が台数倍になる**。

**対応案**: Rails 8 の既定である Solid Cache（DB にキャッシュを持つので Redis 等が不要）か、
`:mem_cache_store` / `:redis_cache_store` を明示する。単一インスタンス運用なら
現状でも動くが、暗黙の既定に頼っている点は明示しておきたい。

---

### 🟢-1　HTML のフィードもページネーションする

**現状**: API 側（`/api/v1/diaries` `/api/v1/galleries` など）は全てページング済みだが、
HTML のフィード（`/diary/view`、`/gallery/my_gallery` など）は全件表示のまま。

`DiaryFeedQueryService` / `GalleryFeedQueryService` は `scope_for` と `build` に
分かれているため Rails 側は `pagy` を挟むだけで済む。フロント側にページ送り UI
（既存の `Pagination` コンポーネント）を足す作業がメイン。

---

### 🟢-2　Three.js 遅延読み込み

**現状**: `three@0.183.2`（`application.js` 2.7MB の主要因、`SelectedGalleryPage` が静的 import）。

**2026-08 調査結果**: `esbuild --splitting` + `React.lazy` でチャンク分割を試みたが、
本番で 3D ビューワーが 404 になることを確認していったん見送った。

原因: `app/assets/config/manifest.js` の `link_tree ../builds` により、esbuild が生成した
チャンクファイルに対して Sprockets が**さらに独自のダイジェストを付与**する。
esbuild がバンドル内に埋め込む動的 import の参照文字列は元のファイル名のままなので、
ブラウザの実行時 `import()` が実在しないパスを叩いて失敗する。

Propshaft へ移行すれば二重ダイジェストが起きなくなるため、🟡-1 とセットで対応する。

---

### 🟢-3　`to_json` → `json_escape` 明示化

**現状**: 全 ERB ビュー（45 ファイル）が `<%= @page_props.to_json %>` を使用。
`<%=` の自動エスケープで現状は安全だが、将来 `<%-` に変えると即 XSS になる。

```erb
<%# 現状（暗黙的エスケープ） %>
<div data-props="<%= @page_props.to_json %>"></div>

<%# 改善（明示的） %>
<div data-props="<%= json_escape @page_props.to_json %>"></div>
```

---

### 🟢-4　未使用になった HTML 投稿ルートの整理

フロントエンドを `/api/v1` に移行した結果、以下は React から呼ばれなくなった。

- `POST /gallery/view`（`gallery#upload`）
- `POST /gallery/selected/good/:id`、`POST /gallery/selected/comment/:id`
- `POST /diary/show/:id/good`、`POST /diary/show/:id/comment`、`POST /diary/post`
- `POST /favorite/:id/add`、`POST /favorite/:id/delete`
- `POST /match/send/:id`、`POST /scout/send/:id`

いずれも認証・バリデーション込みで動作しテストもあるため、放置しても実害はない。
消す場合は Rack::Attack のスロットル設定とテストも合わせて整理すること。

---

## 完了済み（参考）

### 2026-08　API の品質改善（ページネーション / レート制限 / 型契約）

- **件数無制限だった一覧 API をすべてページネーション対応**にした。
  `creators#index` 以外の一覧が全件返す実装で、データが増えるほど
  レスポンスが膨らむ状態だった。`?page=` `?per_page=`（上限100件）を共通化し、
  フィード系は QueryService を `scope_for` / `build` に分割して
  「ページを切り出してから集計する」形にした
  （分けないと1ページ返すのに全件分の集計クエリが走る）
- **ユーザー単位のレート制限を追加**（Rails 8 の `rate_limit`）。
  IP 単位の Rack::Attack と軸を分けて重ねた。ログインだけは
  メールアドレス単位で数え、多数の IP から1アカウントを狙う
  分散総当たりを塞いだ
- **シリアライザのキー契約テスト**を追加。`frontend/api/types.ts` は
  手書きで、JSON は `JSON.parse` で入ってくるため Rails 側でキー名を
  変えても TypeScript では検出できなかった。全13シリアライザの
  キー集合・camelCase・非公開項目の非混入を固定した
- API のログインが `find_by` + `authenticate` のままでタイミング攻撃に
  脆弱だったのを `authenticate_by` に揃えた（HTML 側だけ直して見落としていた）
- テスト 262 件 → 289 件

### 2026-08　Rails 8.1 化 / 画像アップロードの API 化

- **Rails 7.2（2026-08-09 EOL）→ 8.1.3.1**。`config.load_defaults` も 8.1 へ。
  Brakeman の警告が 1 件（EOLRails）→ 0 件になった
- **パスワードリセット / メール認証を Rails の署名付きトークンへ移行**。
  `has_secure_password reset_token: { expires_in: 1.hour }` と
  `generates_token_for :email_verification`。トークンを DB に保存しなくなり、
  パスワード変更・メールアドレス変更で発行済みリンクが自動失効するようになった
  （不要になった 4 カラムを削除）
- **`User.authenticate_by`** でログインのタイミング攻撃対策。
  **`normalizes :email`** でメールアドレスの正規化を model に集約
  （パスワード再設定で `downcase` が抜けていたのも解消）
- **`params.require().permit()` → `params.expect()`** に全面移行。
  `?user=foo` のような型混同で 500 になっていたのが 400 で返るようになった
- **画像アップロードを API 化**（`POST /api/v1/galleries` / `PATCH /api/v1/profile`）。
  投稿フォームを `GalleryUploadForm` に共通化し、投稿してもページ全体が
  再読み込みされなくなった
- **Bullet 導入**。test では `raise = true` で N+1 を CI で検出する
- テスト 239 件 → 262 件

### 同時に修正したバグ

- `config/storage.yml` が存在せず、`eager_load = true` の本番が起動できなかった
- Dockerfile の Ruby が 3.3.0、Gemfile が 3.3.11 で `docker build` が通らなかった
- `GalleryUploadPage` / `GalleryViewPage` がどこからもマウントされない死にコードだった
  （前者は必須項目の `gallery[comment]` 入力欄が無く、到達できても投稿できない状態）

### 2026-08　JSON API 化 / Rails のモダン化

- **`ActiveSupport::CurrentAttributes` 導入**（`app/models/current.rb`）。
  各コントローラに散在していた `session[:id]` / `session[:creator]` の直接参照 111 箇所を撲滅し、
  セッション操作を `Authentication` / `AdminAuthentication` concern に集約
- **`/api/v1` の JSON API を新設**。詳細は [docs/API.md](docs/API.md)
  - 基底クラス `Api::BaseController < ActionController::API`
  - 統一エラーエンベロープ `{ error: { code, message, details } }`
  - 認証は既定で必須、公開エンドポイントのみ `allow_unauthenticated_access`
- **シリアライザ層の導入**（Alba, `app/serializers/`）。
  HTML の `@page_props` と API のレスポンスが同じシリアライザを通るようにした
- **クエリオブジェクトの追加**: `RecruitingCreatorsQuery` / `GalleryDetailQueryService`
- **フロントエンドの型付き API クライアント**（`frontend/api/`）
- **Rack::Attack を API 経路にも適用**
- **`taggings.taggable_id` の型不一致**を修正（タグ検索が機能していなかった）

### それ以前

- `users.email` / `matches` の DB ユニーク制約追加
- `ORDER BY RAND()` 廃止
- `deleted_at` とソフトデリートの方針統一
