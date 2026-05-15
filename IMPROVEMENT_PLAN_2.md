# SucSeed 追加修正計画

IMPROVEMENT_PLAN.md 完了後に発見した残存バグ・セキュリティ問題。
優先度順に対応する。

---

## Phase A: セキュリティ修正（最優先）

### A-1. ログアウト時のセッション残留

**対象**: `app/controllers/user_controller.rb` — `logout` アクション

`session[:id] = nil` と `session[:creator] = nil` を個別に nil にするだけでは
他のセッションデータが残存する可能性がある。`reset_session` で完全破棄すべき。

```ruby
# 現在
def logout
  session[:id] = nil
  session[:creator] = nil
  flash[:success] = "ログアウト"
  redirect_to "/index"
end

# 修正後
def logout
  reset_session
  flash[:success] = "ログアウト"
  redirect_to "/index"
end
```

- [x] `user_controller.rb` — `logout` を `reset_session` に変更

---

### A-2. `user_params` で `:id` を permit している

**対象**: `app/controllers/user_controller.rb` — `user_params` メソッド

新規ユーザー登録時のマスアサインメントに `:id` が含まれている。
`User` モデルは `has_secure_token :id` を使用しているため、外部から `:id` を
指定できると既存ユーザーの ID と衝突を引き起こす可能性がある。

```ruby
# 現在
params.require(:user).permit(:id, :name, :avatar_path, :email, ...)

# 修正後（:id を削除）
params.require(:user).permit(:name, :avatar_path, :email, :birthday,
                              :password, :password_confirmation, :is_man, :is_creator)
```

- [x] `user_controller.rb` — `user_params` から `:id` を削除

---

## Phase B: 機能バグ修正

### B-1. `email_certified` アクションの実行時エラー

**対象**: `app/controllers/user_controller.rb` — `email_certified` アクション

2つのバグがある:

1. `User.find_by("id = ?", params[:id]).select("users.is_certified")`
   → `find_by` はインスタンスを返すため、`select` を呼ぶと `NoMethodError`

2. `user.update_all(:is_certified => 1)`
   → `update_all` はクラスメソッド。インスタンスに呼ぶと `NoMethodError`

```ruby
# 現在（バグあり）
def email_certified
  if User.find_by("id = ?", params[:id]).select("users.is_certified")
    redirect_to "/index"
  else
    user = User.find_by("id = ?", params[:id])
    if user.update_all(:is_certified => 1)
      ...
    end
  end
end

# 修正後
def email_certified
  user = User.find_by(id: params[:id])
  if user.nil? || user.is_certified?
    redirect_to "/index"
  else
    if user.update(is_certified: true)
      flash[:success] = "メールアドレス認証完了"
    else
      flash[:danger] = "メールアドレス認証エラー"
    end
    redirect_to "/index"
  end
end
```

- [x] `user_controller.rb` — `email_certified` のバグを修正

---

### B-2. `match_controller.rb` — 誤ったリダイレクト先

`appeal_answer_sorry`、`scout_answer_ok`、`scout_answer_sorry` のリダイレクト先が
存在しないルートを指している。

| アクション | 現在 | 修正後 | 対応ルート |
|---|---|---|---|
| `appeal_answer_sorry` (成功/失敗) | `/match/appeal/list` | `/match/appealed/list` | `match#appealed_list_view` |
| `scout_answer_ok` (成功/失敗) | `/scouted/list` | `/match/scouted/list` | `match#scouted_show` |
| `scout_answer_sorry` (成功/失敗) | `/scouted/list` | `/match/scouted/list` | `match#scouted_show` |

計6箇所すべて 404 になっている。

- [x] `match_controller.rb` — 6箇所のリダイレクト先を修正

---

### B-3. `flash.now` の残存誤用

IMPROVEMENT_PLAN A-3 で修正したが `my_page_controller.rb` の2箇所が未修正。

| ファイル | 行 | 問題 | 修正 |
|---|---|---|---|
| `my_page_controller.rb` | L4 | `redirect_to "/index"` 直前に `flash.now[:danger]` | `flash[:danger]` に変更 |
| `my_page_controller.rb` | L63 | `redirect_to "/my_page/my_page"` 直前に `flash.now[:danger]` | `flash[:danger]` に変更 |

- [x] `my_page_controller.rb` — L4, L63 を `flash[:danger]` に修正

---

## Phase C: nil ガード不足（NoMethodError 防止）

### C-1. `your_page_controller.rb` — nil ガード不足

**`creator_show`**: `:id` で存在しないクリエイターを参照すると `@creator` が `nil`
となり、次の行で `NoMethodError`。

```ruby
# @creator が nil の場合 NoMethodError
@art_category = ArtCategory.find_by(id: @creator.art_category_id)
```

**`heir_show`**: `:id` に存在しないユーザーを渡すと `@user` が `nil` になる。

修正方針: 見つからない場合は `redirect_to "/index"` で早期リターン。

```ruby
# creator_show — @creator nil チェック追加
@creator = User.joins(:creator).select("users.*, creators.*").find_by(creators: {user_id: params[:id]})
return redirect_to "/index" unless @creator

# heir_show — @user nil チェック追加
@user = User.find_by(id: params[:id])
return redirect_to "/index" unless @user
```

- [x] `your_page_controller.rb` — `creator_show`・`heir_show` に nil ガードを追加

---

## Phase D: コード品質（低優先度）

### D-1. `find_by("id = ?", ...)` をハッシュ構文に統一

Rails 慣用の `find_by(id: params[:id])` に統一。安全性は同等だが可読性が向上する。

対象ファイル:
- `user_controller.rb` — `email_certified_show`・`email_certified`
- `gallery_controller.rb` — `user_view`・`selected_gallery`・`search_user_tag`
- `your_page_controller.rb` — `heir_show`
- `admin_edit_controller.rb` — `user_edit_show`・`user_edit`

- [x] 各ファイルで `find_by("id = ?", x)` → `find_by(id: x)` に変更（`where("id = ?", x)` → `where(id: x)` も含む）

---

## 作業順序

```
A-1 (logout reset_session) → A-2 (user_params :id 削除)
  ↓
B-1 (email_certified バグ) → B-2 (redirect 先修正) → B-3 (flash.now 残存)
  ↓
C-1 (nil ガード)
  ↓
D-1 (find_by 構文統一)
```

A・B は単独コミットとして適切なサイズ。C+D をまとめて1コミットでも可。
