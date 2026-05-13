# SucSeed 改修計画

Rails 6/7 + React (TSX) 移行後の残課題。セキュリティ → モデル設計 → コントローラ の順で対応。

---

## Phase A: セキュリティ修正（最優先）

### A-1. SQLインジェクション脆弱性

**対象**: `app/controllers/admin_edit_controller.rb`

`Model.delete(params[:id])` は Rails の strong parameters の型チェックを経ていない整数以外の値を直接 SQL に渡す。`find + destroy` に変更することでコールバックも正しく発火する。

| アクション | 現在 | 修正後 |
|---|---|---|
| `user_delete` | `User.delete(params[:id])` | `User.find(params[:id]).destroy` |
| `diary_delete` | `Diary.delete(params[:id])` | `Diary.find(params[:id]).destroy` |
| `diary_comment_delete` | `DiaryComment.delete(params[:id])` | `DiaryComment.find(params[:id]).destroy` |
| `gallery_delete` | `Gallery.delete(params[:id])` | `Gallery.find(params[:id]).destroy` |

- [x] `admin_edit_controller.rb` — 4箇所を `find.destroy` に変更

---

### A-2. セッション固定攻撃対策

**対象**: `app/controllers/user_controller.rb` — `login` アクション

ログイン成功後にセッション ID が再生成されない。攻撃者が事前に取得したセッション ID を維持できる。

```ruby
# 現在
session[:id] = user[:id]

# 修正後（reset_session でセッション ID を再生成してから設定）
old_session_data = session.to_hash
reset_session
old_session_data.each { |k, v| session[k] = v }
session[:id] = user[:id]
```

- [x] `user_controller.rb` — `login` アクションにセッション再生成を追加

---

### A-3. `flash.now` 誤用修正

`flash.now` は `render` と組み合わせた場合のみ有効。`redirect_to` の前後で使うと次のリクエストでメッセージが消える。

| ファイル | 行 | 問題 | 修正 |
|---|---|---|---|
| `creator_controller.rb` | L37 | `redirect_to` 直前に `flash.now[:success]` | `flash[:success]` に変更 |
| `message_controller.rb` | L24 | `render` なし `flash.now[:information]` | `flash[:information]` に変更 |
| `message_controller.rb` | L31 | 同上 | `flash[:information]` に変更 |

- [x] `creator_controller.rb` — L37 を `flash[:success]` に修正
- [x] `message_controller.rb` — L24, L31 を `flash[:information]` に修正

---

## Phase B: モデル修正

### B-1. `user.rb` の `has_many` 重複定義修正

**対象**: `app/models/user.rb`

同じ関連名で2回定義すると後の定義が前を上書きする。`send_user_id` を使う関連が無効化されている。

```ruby
# 現在（重複 — 後の定義が上書き）
has_many :messages, class_name: 'Message', foreign_key: 'send_user_id'
has_many :messages, class_name: 'Message', foreign_key: 'receive_user_id'

# 修正後（別名で定義）
has_many :sent_messages,     class_name: 'Message', foreign_key: 'send_user_id'
has_many :received_messages, class_name: 'Message', foreign_key: 'receive_user_id'
```

対象の重複定義:

| 関連名 | foreign_key 1 | foreign_key 2 | 修正後の別名 |
|---|---|---|---|
| `messages` | `send_user_id` | `receive_user_id` | `sent_messages` / `received_messages` |
| `favorites` | `user_id` | `favorite_user_id` | `favorites` / `favorited_by` |
| `matches` | `target_user_id` | `user_id` | `target_matches` / `sent_matches` |
| `message_lists` | `creator_user_id` | `heir_user_id` | `creator_message_lists` / `heir_message_lists` |

⚠️ コントローラ側で `user.messages` 等を使っている箇所があれば同時修正が必要。

- [x] `user.rb` — 重複する `has_many` を別名に分割
- [x] 影響を受けるコントローラを確認・修正（`message_controller.rb`, `match_controller.rb`）

---

### B-2. `dependent: :destroy` 追加

**対象**: `app/models/user.rb`, `app/models/diary.rb`, `app/models/gallery.rb`

現状は親レコードを削除しても子レコードが DB に残存する（孤児レコード）。

**user.rb に追加すべき `dependent: :destroy`**:
- `has_one :creator`
- `has_one :heir`
- `has_many :diaries`
- `has_many :diary_comments`
- `has_many :diary_goods`
- `has_many :galleries`
- `has_many :gallery_goods`
- `has_many :gallery_comments`
- `has_many :inquiries`
- `has_many :favorites`（B-1 で改名後）
- `has_many :sent_messages`（B-1 で改名後）
- `has_many :received_messages`（B-1 で改名後）

**diary.rb に追加すべき `dependent: :destroy`**:
- `has_many :diary_goods`
- `has_many :diary_comments`

**gallery.rb に追加すべき `dependent: :destroy`**:
- `has_many :gallery_goods`
- `has_many :gallery_comments`

- [x] `user.rb` — 全 has_many / has_one に `dependent: :destroy` 追加
- [x] `diary.rb` — `has_many` に `dependent: :destroy` 追加
- [x] `gallery.rb` — `has_many` に `dependent: :destroy` 追加

---

## Phase C: コントローラ修正

### C-1. `render` 非標準呼び出しの統一

Rails 5.2+ では `render :template_name` が標準。`render action:` や `render :'path/template'` は古い記法。

| ファイル | 現在 | 修正後 |
|---|---|---|
| `inquiry_controller.rb` L11 | `render :'inquiry/input_page'` | `render :input_page` |
| `inquiry_controller.rb` L35 | `render action: :input_page` | `render :input_page` |
| `admin_controller.rb` L19 | `render action: :admin_login` | `render :admin_login` |
| `admin_controller.rb` L37 | `render action: :admin_create` | `render :admin_create` |
| `admin_edit_controller.rb` L68 | `render :'admin_edit/admin_gallery_edit'` | `render :admin_gallery_edit` |
| `admin_edit_controller.rb` L94 | `render action: :user` | `render :admin_user_edit` |

- [x] `inquiry_controller.rb` — 2箇所修正
- [x] `admin_controller.rb` — 2箇所修正
- [x] `admin_edit_controller.rb` — 2箇所修正

---

### C-2. `routes.rb` 重複・問題修正

**対象**: `config/routes.rb`

| 問題 | 対象行 | 修正 |
|---|---|---|
| `message/add/:id` が GET + POST の両方 | L30 + L106 | フロントエンドの使用方法を確認して一方を削除 |
| `message/history/:id` が GET + POST の両方 | L31 + L107 | 同上 |
| `/page/heir/:id/` のトレーリングスラッシュ | L19 | `/page/heir/:id` に修正 |

- [x] `routes.rb` — フロントエンドの `fetch`/`href` を確認後、重複ルートを削除
- [x] `routes.rb` — トレーリングスラッシュ削除

---

## 対応しないこと

| 項目 | 理由 |
|---|---|
| `before_action` による認証チェック追加 | 各アクション内に `session[:id].present?` チェックがある。devise への移行は規模が大きすぎる |
| 削除を `DELETE` メソッドへ変更 | フロントエンド（TSX）の fetch 呼び出し変更も伴う。現状の `POST` のまま維持 |
| admin Basic認証の bcrypt 化 | 環境変数によるパスワード比較は現状で十分。過剰対応 |
| TSX の修正 | `any` 型なし・`console.log` なし・`strict: true` 有効のため不要 |

---

## 作業順序

```
A-1 (SQL脆弱性) → A-2 (セッション固定) → A-3 (flash.now)
  ↓
B-1 (has_many 重複) → B-2 (dependent: :destroy)
  ↓
C-1 (render 統一) → C-2 (routes 重複)
```

B-1 の has_many 別名変更はコントローラへの影響があるため、B-1 完了後に影響箇所を確認してから B-2 に進む。
