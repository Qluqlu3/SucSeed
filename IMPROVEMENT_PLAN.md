# SucSeed 改善計画

過去の改修（IMPROVEMENT_PLAN_2.md / REFACTORING_CHECKLIST.md / SCSS_TO_TAILWIND_PLAN.md）はすべて完了済み。
このファイルは **次に取り組む課題** の一覧。優先度順。

---

## 優先度マップ

| 優先度 | 項目 | ファイル / 対象 | 工数 | 状態 |
|:------:|------|----------------|:----:|:----:|
| 🔴 高 | `config.load_defaults` を 7.2 に更新 | `config/application.rb` | S | ✅ 完了 |
| 🔴 高 | `users.email` に DB ユニーク制約追加 | migration | S | 未着手 |
| 🔴 高 | `heir_update` の空 `else` ブロック修正 | `heir_controller.rb:81` | S | 未着手 |
| 🔴 高 | テストカバレッジの改善 | `test/` | L | 未着手 |
| 🟡 中 | `matches` 複合ユニーク制約 | migration | S | 未着手 |
| 🟡 中 | 認証 `before_action` の集約 | 全コントローラ | M | 未着手 |
| 🟡 中 | `ORDER BY RAND()` 廃止 | `gallery_controller.rb` | S | 未着手 |
| 🟡 中 | N+1 クエリ調査・修正 | diary / gallery / index controller | M | 未着手 |
| 🟡 中 | Dockerfile の yarn 削除 | `Dockerfile` | S | 未着手 |
| 🟢 低 | `to_json` → `json_escape` 明示化 | 全 ERB ビュー (47 ファイル) | S | 未着手 |
| 🟢 低 | `deleted_at` とソフトデリートの方針統一 | モデル・schema | M | 未着手 |
| 🟢 低 | Three.js 遅延読み込み | `frontend/` | S | 未着手 |
| 🟢 低 | `acts-as-taggable-on` バージョン固定 | `Gemfile` | S | 未着手 |

工数: S = 30分以内 / M = 半日程度 / L = 複数日

---

## 詳細

### 🔴-1　`config.load_defaults` 7.2 への更新 ✅

**完了済み。** 以下の変更を実施:

| ファイル | 変更前 | 変更後 |
|----------|--------|--------|
| `config/application.rb:12` | `config.load_defaults 5.2` | `config.load_defaults 7.2` |
| `config/environments/development.rb` | `config.cache_classes = false` | `config.enable_reloading = true` |
| `config/environments/development.rb` | `config.active_support.deprecation = :log` | `config.active_support.report_deprecations = true` |
| `config/environments/test.rb` | `config.cache_classes = true` | `config.enable_reloading = false` |
| `config/environments/test.rb` | `config.active_support.deprecation = :stderr` | `config.active_support.report_deprecations = false` |

7.2 で有効になった主なデフォルト:
- Cookie に SameSite=Lax（CSRF 対策強化）
- 暗号化・署名ダイジェストが SHA256 に統一
- 外部 URL への `redirect_to` が例外に（open redirect 対策）
- Cookie にメタデータ付与（purpose/expiry の偽造防止）

---

### 🔴-2　`users.email` に DB ユニーク制約追加

**現状**: `validates :email, uniqueness: true` のみ。同時リクエストのレース条件で重複登録が可能。

```ruby
# 追加するマイグレーション
add_index :users, :email, unique: true
```

---

### 🔴-3　`heir_controller.rb#heir_update` の空 `else`

**現状**: `session[:id]` が nil のとき何もせずレスポンスが宙ぶらりになる（`render` も `redirect_to` もない）。

```ruby
# app/controllers/heir_controller.rb:81-82
else
  # ← ここに redirect_to "/index" が必要
end
```

---

### 🔴-4　テストカバレッジの改善

**現状**: 3 テストのみ（ArtCategory モデル・GmailMailer・InquiryController）。
全コントローラ・全モデルのテストが空スタブのまま。

優先的に書くべきテスト:
1. `User` モデルのバリデーション（email 重複・パスワード長）
2. ログイン/ログアウトの認証フロー
3. 認証なしでアクセスした場合のリダイレクト確認

---

### 🟡-5　`matches` 複合ユニーク制約

**現状**: 同じユーザーが同じ相手に複数回アピール/スカウトを送れる。

```ruby
# 追加するマイグレーション
add_index :matches, [:user_id, :target_user_id, :is_scout], unique: true
```

---

### 🟡-6　認証 `before_action` の集約

**現状**: `session[:id].present?` チェックが各アクションに手書き散在。
`ApplicationController` に `before_action :require_login` を定義して集約する。

---

### 🟡-7　`ORDER BY RAND()` 廃止

**現状**: `gallery_controller.rb` でおすすめギャラリーに `RAND()` を使用。
レコード数が増えるとフルテーブルスキャンになる。

```ruby
# 現状
Gallery.tagged_with(...).order("RAND()").limit(3)

# 改善案（アプリ側でシャッフル）
Gallery.tagged_with(...).limit(20).to_a.sample(3)
```

---

### 🟡-8　N+1 クエリ調査・修正

**調査が必要な箇所**:
- `diary_controller.rb#select_diary` — 複数の `joins` チェーン
- `index_controller.rb#root` — `User.joins(:creator)` を複数回実行
- `gallery_controller.rb` — `GalleryGood.where(...)` が複数メソッドで重複

Bullet gem を開発環境に追加して実測するのが確実。

---

### 🟡-9　Dockerfile の yarn 削除

**現状**: `npm install -g yarn` が残っている（pnpm 移行済み）。

```dockerfile
# 削除対象の行
RUN npm install -g yarn
```

---

### 🟢-10　`to_json` → `json_escape` 明示化

**現状**: 全 ERB ビュー（47 ファイル）が `<%= @page_props.to_json %>` を使用。
`<%=` の自動エスケープで現状は安全だが、将来 `<%-` に変えると即 XSS になる。

```erb
<%# 現状（暗黙的エスケープ） %>
<div data-props="<%= @page_props.to_json %>"></div>

<%# 改善（明示的） %>
<div data-props="<%= json_escape @page_props.to_json %>"></div>
```

---

### 🟢-11　`deleted_at` とソフトデリートの方針統一

**現状**: `admins` `users` 等に `deleted_at` カラムが存在するが、
コードは `dependent: :destroy` でハードデリートしている。方針を決めて統一する。

選択肢:
- A) `discard` gem でソフトデリートを実装
- B) `deleted_at` カラムを削除してハードデリートに統一

---

### 🟢-12　Three.js 遅延読み込み

**現状**: `three@0.183.2`（約 2.3MB バンドルの一因）が同期ロード。
使用箇所が少なければ `import()` 動的読み込みに変更してバンドルサイズを削減できる。

---

### 🟢-13　`acts-as-taggable-on` バージョン固定

**現状**: `>= 6.0.0` という緩い指定。最新は 10.x 系で非互換変更あり。
`~> 10.0` に明示して Dependabot 警告を防ぐ。
