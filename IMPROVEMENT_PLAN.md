# SucSeed 改善計画

過去の改修（IMPROVEMENT_PLAN_2.md / REFACTORING_CHECKLIST.md / SCSS_TO_TAILWIND_PLAN.md）はすべて完了済み。
このファイルは **次に取り組む課題** の一覧。優先度順。

（2026-08時点で全項目の状態を実コードと突き合わせて更新。旧版はDB制約やソフトデリート統一など
既に対応済みの項目が「未着手」のまま放置されていた）

---

## 優先度マップ

| 優先度 | 項目 | ファイル / 対象 | 工数 | 状態 |
|:------:|------|----------------|:----:|:----:|
| 🟢 低 | `to_json` → `json_escape` 明示化 | 全 ERB ビュー (45 ファイル) | S | 未着手 |
| 🟢 低 | N+1 の継続監視（Bullet gem導入） | 開発環境 | S | 未着手 |
| 🟢 低 | Three.js 遅延読み込み | `frontend/` | M | 未着手（要調査結果を参照） |

工数: S = 30分以内 / M = 半日程度 / L = 複数日

---

## 詳細

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

**現状**: `diary_controller.rb#select_diary`・`gallery_controller.rb` 等の複雑なクエリは
`DiaryFeedQueryService` / `GalleryFeedQueryService` への抽出時に `joins`/`includes` を整理済み。
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

また `application.ts` は全ページの `mountXxxPage.tsx` を1つのエントリーポイントで静的importする
構成のため、`React.lazy` を使ってもコード分割（`--splitting`）が無ければバンドルサイズは一切減らない
（動的importがビルド時に同一ファイルへインライン化されるだけ）。

**対応するには以下のいずれかが必要（本項目より一段大きい作業）**:

- Sprocketsの二重フィンガープリントを回避する仕組み（`app/assets/builds` 配下のJSを
  Sprocketsの外（`public/`直下等）で配信するなど、アセットパイプライン設計の変更）
- または `application.ts` 自体をページ単位のエントリーポイントに分割する設計変更

---

## 完了済み（参考）

以下は旧版で「未着手」と記載されていたが、その後の作業で対応済みになっている項目。

- `config.load_defaults` を 7.2 に更新
- `users.email` に DB ユニーク制約追加（`index_users_on_email_unique`）
- `heir_update` の空 `else` ブロック修正（現在は両分岐で `flash` + `redirect_to` 済み）
- テストカバレッジの改善（3件 → 106件。CarrierWaveアップロード検証・Rack::Attackスロットル・
  各コントローラの主要分岐を中心に拡充）
- `matches` 複合ユニーク制約（`index_matches_on_user_id_and_target_user_id`）
- 認証 `before_action` の集約（`ApplicationController#require_login` に一本化し、各コントローラが
  `before_action :require_login, except: [...]` で利用）
- `ORDER BY RAND()` 廃止（全5箇所をRuby側サンプリングに置き換え）
- Dockerfile の yarn 削除（現在 `Dockerfile` に yarn の記述なし）
- `deleted_at` とソフトデリートの方針統一（発火しない `dependent: :destroy` を削除）
- `acts-as-taggable-on` バージョン固定（`~> 13.0`。2026-08対応）
