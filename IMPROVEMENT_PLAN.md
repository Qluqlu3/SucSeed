# SucSeed 改善計画

過去の改修（IMPROVEMENT_PLAN_2.md / REFACTORING_CHECKLIST.md / SCSS_TO_TAILWIND_PLAN.md）はすべて完了済み。
このファイルは **次に取り組む課題** の一覧。優先度順。

---

## 優先度マップ

| 優先度 | 項目 | ファイル / 対象 | 工数 | 状態 |
|:------:|------|----------------|:----:|:----:|
| 🔴 高 | **Rails 8 へのアップグレード（7.2 は 2026-08-09 に EOL）** | `Gemfile` 他 | L | 未着手 |
| 🟡 中 | 画像アップロードの API 化 | `Api::V1` / CarrierWave | M | 未着手 |
| 🟢 低 | `to_json` → `json_escape` 明示化 | 全 ERB ビュー (45 ファイル) | S | 未着手 |
| 🟢 低 | N+1 の継続監視（Bullet gem導入） | 開発環境 | S | 未着手 |
| 🟢 低 | Three.js 遅延読み込み | `frontend/` | M | 未着手（要調査結果を参照） |

工数: S = 30分以内 / M = 半日程度 / L = 複数日

---

## 詳細

### 🔴-1　Rails 8 へのアップグレード

**現状**: Rails 7.2.3.2。Brakeman が `EOLRails` で警告している。

```
Confidence: High
Category: Unmaintained Dependency
Message: Support for Rails 7.2.3.2 ended on 2026-08-09
```

7.2 系はサポート終了済みで、今後の脆弱性修正が提供されない。
`Gemfile` は `gem 'rails', '>= 7.2.3.1', '< 8.0'` で 8 系を明示的に除外している。

**主な確認ポイント**:

- `config.load_defaults` を 8.0 へ（現在 7.2）
- Sprockets + jsbundling のまま行くか、Propshaft へ移行するか
- `sprockets-rails` / `carrierwave` / `acts-as-taggable-on` / `pagy` の Rails 8 対応状況
- `Rails/StrongParametersExpect`（`.rubocop.yml` で無効化中）を有効化できる

---

### 🟡-1　画像アップロードの API 化

**現状**: アバター・ギャラリー投稿は multipart が必要なため HTML フォームのまま
（`PATCH /my_page/update` / `POST /gallery/view`）。
`Api::V1::ProfileController#profile_params` は `:avatar_path` を意図的に除外している
（文字列を CarrierWave に渡すと `CarrierWave::FormMultipart` が飛ぶため）。

**対応案**: 署名付き直接アップロード、または `multipart/form-data` を受ける専用エンドポイントを
`Api::V1` に追加する。

---

### 🟢-1　`to_json` → `json_escape` 明示化

**現状**: 全 ERB ビュー（45 ファイル）が `<%= @page_props.to_json %>` を使用。
`<%=` の自動エスケープで現状は安全だが、将来 `<%-` に変えると即 XSS になる。

```erb
<%# 現状（暗黙的エスケープ） %>
<div data-props="<%= @page_props.to_json %>"></div>

<%# 改善（明示的） %>
<div data-props="<%= json_escape @page_props.to_json %>"></div>
```

---

### 🟢-2　N+1 の継続監視（Bullet gem導入）

**現状**: フィード系の複雑なクエリは `DiaryFeedQueryService` / `GalleryFeedQueryService` /
`GalleryDetailQueryService` / `RecruitingCreatorsQuery` へ抽出し、`includes` を整理済み。
ただし体系的な検出の仕組み（Bullet gem等）は未導入で、今後の変更でN+1が再発しても気付けない。

---

### 🟢-3　Three.js 遅延読み込み

**現状**: `three@0.183.2`（`application.js` 2.7MBの主要因、`SelectedGalleryPage`が静的import）。

**2026-08 調査結果**: `esbuild --splitting` + `React.lazy`でチャンク分割を試みたが、
実際に `RAILS_ENV=production` で `assets:precompile` を実行して検証した結果、
**本番で3Dビューワーが404になることを確認し、いったん見送った**。

原因: `app/assets/config/manifest.js` の `link_tree ../builds` により、esbuildが生成した
チャンクファイル（例: `ThreeViewer-LYE4RNF7.js`）に対してSprocketsが**さらに独自のダイジェストを
付与**する（`ThreeViewer-LYE4RNF7-<sprockets-digest>.js`として `public/assets/` に出力）。
esbuildがバンドル内に埋め込む動的import参照文字列は元のファイル名（Sprocketsダイジェスト無し）の
ままのため、ブラウザの実行時 `import()` が実在しないパスを叩いて失敗する。

**対応するには以下のいずれかが必要（本項目より一段大きい作業）**:

- Sprocketsの二重フィンガープリントを回避する仕組み（Propshaft 移行を含む）
- または `application.ts` 自体をページ単位のエントリーポイントに分割する設計変更

Rails 8 アップグレード（🔴-1）で Propshaft へ移行するなら、そのついでに解消できる可能性が高い。

---

## 完了済み（参考）

### 2026-08　JSON API 化 / Rails のモダン化

- **`ActiveSupport::CurrentAttributes` 導入**（`app/models/current.rb`）。
  各コントローラに散在していた `session[:id]` / `session[:creator]` の直接参照 111 箇所を撲滅し、
  セッション操作を `Authentication` / `AdminAuthentication` concern に集約
- **`/api/v1` の JSON API を新設**（14 コントローラ）。詳細は [docs/API.md](docs/API.md)
  - 基底クラス `Api::BaseController < ActionController::API`
  - 統一エラーエンベロープ `{ error: { code, message, details } }`
  - 認証は既定で必須、公開エンドポイントのみ `allow_unauthenticated_access`
- **シリアライザ層の導入**（Alba, `app/serializers/`）。
  各コントローラで手書きしていた camelCase ハッシュを集約し、HTML の `@page_props` と
  API のレスポンスが同じシリアライザを通るようにした（旧 `app/presenters/` は廃止）
- **クエリオブジェクトの追加**: `RecruitingCreatorsQuery` / `GalleryDetailQueryService`。
  文字列 `select` で `users.*` と別テーブルを混ぜていた壊れやすいクエリを、
  実 ActiveRecord オブジェクト + `includes` に置き換え
- **フロントエンドの型付き API クライアント**（`frontend/api/`）。
  `ApiResult<T>` を判別可能ユニオンにして、レスポンスを確認せずに state を更新できないようにした
- **Rack::Attack を API 経路にも適用**。HTML 版と同じカウンタを共有するよう matcher を共通化
- テスト 106 件 → 239 件

### 同時に修正したバグ

- **`taggings.taggable_id` の型不一致**（マイグレーション `20260820000001`）。
  integer カラムに 24 文字のトークン文字列を入れており MySQL が先頭数値に丸めていたため、
  ギャラリーのタグが全件で共有され、タグ検索が機能していなかった
- `gallery#selected_gallery` の `currentUser` に投稿者が入っていた（コメント欄に他人の名前が出る）
- `gallery#user_view` の `myGood` 判定が `gallery_goods.id` と `galleries.id` を比較していた
- `index#index` のおすすめ職人が `Heir` インスタンスをそのまま `where` に渡していて絞り込めていなかった
- `your_page#heir_show` の `targetUserId` が `params[:id].to_i` で 0 になり、スカウト送信が失敗していた
- `creator#edit` が職人以外のとき何もレンダリングせず例外になっていた
- `match#*_answer` が `update_all` の戻り値（0 も truthy）で成否判定していた
- `MyDiaryPage` が投稿直後に `Date.now()` の仮 ID でカードを組み立てていた（削除・いいねが動かない）

### それ以前

- `config.load_defaults` を 7.2 に更新
- `users.email` に DB ユニーク制約追加（`index_users_on_email_unique`）
- `matches` 複合ユニーク制約（`index_matches_on_user_id_and_target_user_id`）
- `ORDER BY RAND()` 廃止（全5箇所をRuby側サンプリングに置き換え）
- `deleted_at` とソフトデリートの方針統一
- `acts-as-taggable-on` バージョン固定（`~> 13.0`）
