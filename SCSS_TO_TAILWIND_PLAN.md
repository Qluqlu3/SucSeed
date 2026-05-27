# SCSS → Tailwind CSS 移行計画

## 現状整理

### スタイルの構成

| レイヤー | ファイル | 役割 |
|---|---|---|
| グローバル | `app/assets/stylesheets/application.scss` | Bootstrap import・navbar・グローバルスタイル |
| ページ別 SCSS | `creator/diary/gallery/heir/index/inquiry/match/message/my_page/user/your_page.scss` | 各ページのカスタムクラス（計 11 ファイル） |
| 管理画面 SCSS | `admin.scss`, `admin_edit.scss` | 管理画面専用スタイル |
| Tailwind | `frontend/styles/tailwind.css` | v4 設定済み。現在は ERB・TSX をスキャンのみ |

### Bootstrap 依存の実態

**Bootstrap CSS（gem 経由）**: `application.scss` で `@import "bootstrap"` している。

Bootstrap の CSS クラスが TSX・ERB 両方に多数使われている。

| 用途 | クラス例 | 使用ファイル |
|---|---|---|
| グリッド | `container-fluid`, `row`, `col-lg-3`, `col-md-6` | IndexPage, MatchPage 等 |
| Navbar | `navbar`, `navbar-expand-lg`, `navbar-collapse`, `navbar-toggler` | `spa/Navbar.tsx` |
| カード | `card`, `card-body`, `card-header`, `card-footer` | 多数 |
| ボタン | `btn`, `btn-primary`, `btn-success` 等 | 多数 |
| モーダル | `modal`, `modal-dialog`, `modal-content` | `spa/LoginModal.tsx` |
| フォーム | `form-control`, `form-group`, `form-label`, `form-check` | 多数 |
| ドロップダウン | `dropdown`, `dropdown-menu`, `dropdown-item` | `spa/NavbarMenuDropdown.tsx` |
| バッジ | `badge` | `admin_edit.scss` |

> ⚠️ **Bootstrap JS 依存**: Navbar collapse・modal open/close・dropdown が Bootstrap JS に依存している。CSS を差し替えるだけでは動作しなくなるため、React state で代替実装が必要。

### カスタム SCSS クラス一覧（主要）

| クラス名 | SCSS ファイル | 概要 |
|---|---|---|
| `.wrapper` | creator/heir/user/match/gallery/my_page/message/inquiry | ページ本体ラッパー（背景・ボーダー・角丸） |
| `.main-title` | creator/heir/user/gallery/match/message/inquiry/diary | ページタイトル帯 |
| `.all-cover-box` | 複数 | `min-height: 100vh` |
| `.my_nav`, `.index-nav` | application/index | Navbar の位置・背景 |
| `.three-box` | index | トップページ説明ボックス |
| `.main-visual` / `.main-visual-box` | index | ヒーロー画像エリア |
| `.list-card-header/body` | match | マッチングカード |
| `.gallery-col`, `.gallery-card` | gallery | ギャラリーグリッド |
| `.message-box`, `.message-list-btn` | message | チャット UI |
| `.my-card-header/body` | creator/heir/my_page | カード内セクション |
| `.login-form-btn`, `.modal`, `.close` | application | ログインモーダル |

---

## 方針

### 移行スコープ

1. **ページ別 SCSS 11 ファイルを削除** → TSX コンポーネントにインライン Tailwind クラスを記述
2. **Bootstrap CSS を削除** → Tailwind ユーティリティで代替
3. **Bootstrap JS 依存コンポーネント（Navbar・Modal・Dropdown）を React state で再実装**
4. `application.scss` は Bootstrap 削除後に最小化（グローバルリセットのみ残す）
5. `admin.scss` / `admin_edit.scss` は最後に対応（管理画面は優先度低）

### Bootstrap JS 代替方針

| コンポーネント | 現状 | 代替案 |
|---|---|---|
| Navbar collapse | Bootstrap JS toggle | React `useState` で開閉 |
| Login Modal | Bootstrap `modal('show')` | React Portal + `useState` |
| Dropdown menu | Bootstrap JS | React `useState` + `useRef` で外クリック閉じ |

### Tailwind テーマ定義

`frontend/styles/tailwind.css` に `@theme` ブロックでプロジェクト固有の CSS 変数を定義する。

```css
@theme {
  /* ── ブランドカラー ─────────────────────────── */
  --color-p-brand:  #6846A5;   /* メインパープル（タイトル帯・カードヘッダー） */
  --color-p-dark:   #503780;   /* ダークパープル（Navbar） */
  --color-p-light:  #EDE8F5;   /* 薄ラベンダー（ラッパー背景） */
  --color-p-pale:   #F7F5FB;   /* 極薄（ページ背景） */
  --color-p-muted:  #9B87C8;   /* ミュートパープル（補助テキスト） */
  --color-p-mid:    #C8BCDF;   /* ボーダー用 */
  --color-p-text:   #3B2A5B;   /* フォームラベル等のダークテキスト */
  --color-p-nav:    #CBB5FF;   /* Navbar リンク hover */

  /* ── フォント ───────────────────────────────── */
  --font-mincho: "ヒラギノ明朝 ProN W6", "HiraMinProN-W6", "HG明朝E",
                 "ＭＳ Ｐ明朝", "MS PMincho", "MS 明朝", serif;
  --font-gothic: 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3',
                 Meiryo, メイリオ, Osaka, 'MS PGothic', sans-serif;
}
```

これにより TSX で `bg-p-brand`, `text-p-dark`, `font-mincho` 等のクラスが使える。

---

## 作業フェーズ

```
Phase 1: テーマ定義
  ↓
Phase 2: グローバルスタイル移行（application.scss）
  ↓
Phase 3: Bootstrap JS コンポーネント再実装（Navbar・Modal・Dropdown）
  ↓
Phase 4: ページ別 SCSS 移行（11 ファイル、ページ単位で進める）
  ↓
Phase 5: Bootstrap CSS 削除・admin SCSS 移行
  ↓
Phase 6: 最終クリーンアップ
```

---

## Phase 1: テーマ定義

- [x] `frontend/styles/tailwind.css` に `@theme` ブロック追加（カラー・フォント変数）
- [x] `@layer base` でグローバルリセット（`body`, `a`, `button` のデフォルト上書き）を Tailwind で定義

---

## Phase 2: グローバルスタイル移行

**対象**: `application.scss`

| 現在の SCSS | 移行先 |
|---|---|
| `body { background-color: #F7F5FB; font-family: ...; }` | `tailwind.css` `@layer base` |
| `.navbar { background-color: #503780; }` | Navbar.tsx に `bg-p-dark` 等 |
| `.navbar-toggler { background-color: #6846A5; }` | NavbarToggleButton.tsx に直接 |
| `.my_nav { ... }` | Navbar.tsx |
| `.dropdown-menu a:hover { color: #6846A5; }` | NavbarMenuDropdown.tsx |
| `.login-form-btn`, `.modal`, `.close` 等 | LoginModal.tsx に直接 |
| `.field_with_errors { background-color: #ff0022; }` | `@layer base` に残す（Rails 自動付与） |

- [x] `tailwind.css` に `@layer components` 追加（navbar / login modal 関連クラスを移動）
- [x] `application.scss` から全 CSS ルールを削除 → `@import` 行のみに整理

---

## Phase 3: Bootstrap JS コンポーネント再実装

### 3-1. Navbar collapse

`spa/Navbar.tsx` と関連コンポーネントを修正。

```tsx
// useState で開閉状態を管理
const [isOpen, setIsOpen] = useState(false);
```

Bootstrap クラス → Tailwind 代替：

| Bootstrap | Tailwind |
|---|---|
| `navbar navbar-expand-lg` | `flex items-center flex-wrap` |
| `collapse navbar-collapse` + JS | `{isOpen && <div>…</div>}` で条件レンダリング |
| `navbar-toggler` | `md:hidden` ボタン |
| `navbar-nav mr-auto` | `flex gap-4` |

- [x] `spa/Navbar.tsx` — `isOpen` state 追加、Bootstrap クラス → Tailwind
- [x] `spa/NavbarToggleButton.tsx` — `onClick` で `isOpen` toggle
- [x] `spa/NavbarMenuDropdown.tsx` — Bootstrap dropdown → React state
- [x] `spa/NavbarBrand.tsx` — Bootstrap クラス → Tailwind
- [x] `spa/NavbarSearchForm.tsx` — Bootstrap クラス → Tailwind
- [x] `spa/NavbarAuthAction.tsx` — Bootstrap クラス → Tailwind

### 3-2. Login Modal

`spa/LoginModal.tsx` を React Portal ＋ useState で再実装。

```tsx
// Bootstrap data-toggle/dismiss の代替
const [isOpen, setIsOpen] = useState(false);
// ReactDOM.createPortal(…, document.body) で描画
```

- [x] `spa/LoginModal.tsx` — Bootstrap modal → React Portal
- [x] `spa/LoginModalHeader/Body/Footer.tsx` — Bootstrap クラス → Tailwind
- [x] `spa/LoginFormField.tsx` — `form-control` → `input w-full border ...`

---

## Phase 4: ページ別 SCSS 移行

各 SCSS ファイルを 1 つずつ対応し、完了後に削除する。

移行作業の手順（1 ページ分）：
1. SCSS ファイルのクラス一覧を確認
2. 対応する TSX コンポーネントを特定
3. TSX の `className` に Tailwind クラスを追加
4. SCSS ファイルを削除
5. ビルドして表示確認

### 優先順（簡単→複雑）

#### inquiry.scss（クラス 6 個・最小）
- [x] `InquiryInputPage.tsx` — `.wrapper`, `.main-title`, `.inquiry-input-label`, `.inquiry-form-btn`, `.all-cover-box`
- [x] `inquiry.scss` 削除

#### heir.scss
- [x] `HeirCreatePage.tsx`, `HeirUpdatePage.tsx`, `HeirShowPage.tsx` — `.wrapper`, `.main-title`, `.my-card-header/body`, `.my-submit`
- [x] `heir.scss` 削除

#### my_page.scss
- [x] `MyPage.tsx`, `MyPageUpdatePage.tsx` — `.wrapper`, `.out-line`, `.my-card-header/body`, `.profile-update-btn`
- [x] `my_page.scss` 削除

#### user.scss
- [x] `UserRegistPage.tsx`, `EmailCertifiedPage.tsx` — `.wrapper`, `.main-title`, `.my-label-text`, `.radio-text`, `.regist-btn`, `.small-text` 等
- [x] `user.scss` 削除

#### creator.scss
- [x] `CreatorCreatePage.tsx`, `CreatorUpdatePage.tsx`, `CreatorShowPage.tsx` — `.wrapper`, `.main-title`, `.my-card-header/body`, `.left-col`, `.small-text`, `.my-regist-btn`, `.my-update-btn` 等
- [x] `creator.scss` 削除

#### match.scss
- [x] `AppealedListPage.tsx`, `AppealShowPage.tsx`, `MatchingPage.tsx`, `ScoutCheckPage.tsx`, `ScoutShowPage.tsx` — `.wrapper`, `.list-card-header/body`, `.name-text`, `.yes-btn`, `.no-btn`, `.empty-text` 等
- [x] `match.scss` 削除

#### diary.scss
- [x] `MyDiaryPage.tsx`, `DiaryPostPage.tsx`, `YourDiaryPage.tsx` 等 — `.icon-color`, `.main-title`, `.post-btn`, `.comment-btn`, `.file-box` 等
- [x] `diary.scss` 削除

#### message.scss
- [x] `MessageListPage.tsx`, `MessagePage.tsx` — `.wrapper`, `.my-row`, `.my-col-left/right`, `.message-box`, `.message-list-btn`, `.col-name-box`
- [x] `message.scss` 削除

#### gallery.scss（複雑）
- [x] `MyGalleryPage.tsx`, `GalleryViewPage.tsx`, `GalleryUploadPage.tsx` 等 — `.gallery-col`, `.gallery-card`, `.gallery-card-body`, `.right-box`, `.in-box`, `.my-submit-btn`, `.right-box-top` 等
- [x] `gallery.scss` 削除

#### your_page.scss（複雑）
- [x] `YourPage.tsx`, `HeirPage.tsx` — `.name-age-box`, `.sex-box`, `.is_man`, `.is_woman`, `.age-box`, `.bar-box`, `.favorite_btn`, `.original-nav`, `.box-margin-pro`, `.profile-avatar` 等
- [x] `your_page.scss` 削除

#### index.scss（最複雑）
- [x] `IndexPage.tsx`, `SearchUserPage.tsx` — `.main-visual`, `.main-visual-box h1`, `.index-nav`, `.three-box`, `.bg-1`, `.info-title`, `.card-box`, `.card-box-name/title`, `.zone` 等
- [x] `index.scss` 削除

---

## Phase 5: Bootstrap CSS 削除・admin SCSS 移行

Phase 4 完了後に Bootstrap CSS を削除する。

### 5-1. Bootstrap グリッド → Tailwind

TSX 内の Bootstrap グリッドクラスを Tailwind に置換。

| Bootstrap | Tailwind 相当 |
|---|---|
| `container-fluid` | `w-full px-0` または削除 |
| `container` | `max-w-7xl mx-auto px-4` |
| `row` | `flex flex-wrap` |
| `col-lg-3` | `w-full lg:w-1/4` |
| `col-md-6` | `w-full md:w-1/2` |
| `col-12` | `w-full` |
| `col-auto` | `w-auto` |

### 5-2. Bootstrap コンポーネント → Tailwind

| Bootstrap | Tailwind 相当 |
|---|---|
| `btn btn-primary` | `px-4 py-2 bg-p-brand text-white rounded hover:opacity-80` |
| `btn btn-success` | `px-4 py-2 bg-green-600 text-white rounded hover:opacity-80` |
| `btn btn-danger` | `px-4 py-2 bg-red-600 text-white rounded hover:opacity-80` |
| `card` | `rounded-lg border border-p-mid` |
| `card-body` | `p-4` |
| `card-header` | `px-4 py-2 bg-p-brand text-white` |
| `form-control` | `w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-p-brand` |
| `form-label` | `block text-p-text text-sm mb-1` |
| `badge` | `inline-block px-2 py-1 text-xs rounded-full` |
| `rounded-circle` | `rounded-full` |
| `text-center` | `text-center` |
| `d-flex` | `flex` |
| `d-none` | `hidden` |
| `mx-auto` | `mx-auto` |

### 5-3. Bootstrap CSS gem 削除

```ruby
# Gemfile から削除
gem 'bootstrap'
gem 'sassc-rails'   # SCSS が不要になれば削除
```

```scss
/* application.scss から削除 */
@import "bootstrap";
```

- [ ] 全 TSX から Bootstrap クラスを Tailwind に置換
- [ ] `Gemfile` — `bootstrap` gem 削除（`bundle install`）
- [ ] `application.scss` — `@import "bootstrap"` 削除

### 5-4. admin SCSS 移行

管理画面は Bootstrap JS を使っていないため比較的容易。

- [x] `admin.scss` → `AdminLoginPage.tsx`, `AdminCreatePage.tsx`
- [x] `admin_edit.scss` → `AdminIndexPage.tsx` 他 8 ページ
- [x] `admin.scss`, `admin_edit.scss` 削除

---

## Phase 6: 最終クリーンアップ

- [ ] `application.scss` を最小化（`@layer base` の `.field_with_errors` のみ残すか `tailwind.css` に移動）
- [ ] `app/assets/stylesheets/*.scss` が全削除されたら `application.scss` 自体も削除を検討
- [ ] Sprockets の SCSS パイプラインが不要になれば `sassc-rails` gem 削除
- [ ] `package.json` / `Gemfile` の不要な依存確認
- [ ] Tailwind の CSS 出力サイズを確認（不要クラスが含まれていないか）

---

## 移行の対応しないこと

| 項目 | 理由 |
|---|---|
| Font Awesome の置き換え | アイコンは Tailwind の範囲外。引き続き gem / CDN を使う |
| Bootstrap JS の `vendor.js` 削除 | Phase 3 で React 実装に移行後に削除。それまで残す |
| `bootstrap-tagsinput.css` の置き換え | プラグイン依存のため対応しない |

---

## リスク・注意事項

1. **Bootstrap JS 削除タイミング**: Navbar/Modal の React 実装が完成するまで `vendor.js` の Bootstrap JS を残すこと。CSS だけ先に削除すると UI が崩れる。
2. **Tailwind のスキャン対象**: TSX に動的クラス名（テンプレートリテラル）を使う場合は Tailwind が検出できない。完全な文字列でクラス名を書くこと（例: `${isOpen ? 'flex' : 'hidden'}` ではなく `isOpen ? 'flex' : 'hidden'`）。
3. **カスタムフォント**: `--font-mincho` 変数を `@theme` に定義すれば `font-mincho` クラスで使えるが、Tailwind v4 の `@theme` での font-family 定義は `--font-{name}` 形式で有効になる。
4. **`%` 単位の値**: `margin: 5vh` 等は Tailwind の任意値（`mt-[5vh]`）で対応。多用する場合は `@theme` で extend するか `@utility` で定義。
5. **admin.scss のスコープ**: `admin.scss` は `body { background-color: #FFF; }` を上書きしている。移行後は `AdminLoginPage` 等で明示的に白背景を指定。

---

## 作業順序まとめ

```
Phase 1 テーマ定義         ← まず着手（後のすべてのベース）
Phase 2 グローバルスタイル  ← Phase 1 直後
Phase 3 Navbar/Modal 再実装 ← 独立して進められる（最大の山）
Phase 4 ページ別 SCSS      ← inquiry から順に、1 ファイルずつ
Phase 5 Bootstrap 削除     ← Phase 3・4 完了後
Phase 6 クリーンアップ      ← Phase 5 完了後
```
