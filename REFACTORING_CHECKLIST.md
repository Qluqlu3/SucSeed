# .erb 削除リファクタリング チェックシート

## 概要

Rails ERB テンプレートを React (TSX) へ完全移行し、`.erb` ファイルを削除するプロジェクト。

---

## Phase 1: 基盤整備 ✅

- [x] `frontend/utils/getJson.ts` 作成（GET fetch ラッパー）
- [x] `spa/session.ts` を `getJson` に移行
- [x] biome フォーマット一括修正（17 ファイル）
- [x] `PostForm` を `spa/` から `components/PostForm/` に移動
- [x] `mountPage.tsx` の `undefined` ガード修正（`fallbackProps ?? {}`）
- [x] `FlashMessages` コンポーネント作成（`components/FlashMessages/`）

---

## Phase 2: Flash 移行 — diary 系 ✅

### TSX
- [x] `MyDiaryPage` — flash Props + FlashMessages 挿入
- [x] `DiaryPostPage` — flash Props + FlashMessages 挿入
- [x] `DiarySelectPage` — flash Props + FlashMessages 挿入
- [x] `YourDiaryPage` — flash Props + FlashMessages 挿入
- [x] `DiaryHeirFavoritePage` — flash Props + FlashMessages 挿入

### Controller
- [x] `diary_controller.rb` — `my_diary`, `regist`(post), `select_diary`, `your_diary`, `heir_favorite_diary` に `flash: flash.to_h` 追加

### ERB（flash.each 削除）
- [x] `diary/my_diary.html.erb`
- [x] `diary/post.html.erb`
- [x] `diary/select_diary.html.erb`
- [x] `diary/your_diary.html.erb`
- [x] `diary/diary_heir_favorite.html.erb`

---

## Phase 2: Flash 移行 — その他 18 ページ ✅

### TSX
- [x] `CreatorCreatePage` — flash Props + FlashMessages 挿入
- [x] `CreatorUpdatePage` — flash Props + FlashMessages 挿入
- [x] `HeirCreatePage` — flash Props + FlashMessages 挿入
- [x] `HeirUpdatePage` — flash Props + FlashMessages 挿入
- [x] `HeirShowPage` — flash Props + FlashMessages 挿入
- [x] `HeirPage` — flash Props + FlashMessages 挿入
- [x] `AppealShowPage` — flash Props + FlashMessages 挿入
- [x] `MatchingPage` — flash Props + FlashMessages 挿入
- [x] `MyPage` — flash Props + FlashMessages 挿入
- [x] `MyPageUpdatePage` — flash Props + FlashMessages 挿入
- [x] `PasswordForgotPage` — flash Props + FlashMessages 挿入（`getCsrfToken` import 修正含む）
- [x] `PasswordResetPage` — flash Props + FlashMessages 挿入
- [x] `UserRegistPage` — flash Props + FlashMessages 挿入
- [x] `IndexPage` — flash Props + FlashMessages 挿入
- [x] `SearchUserPage` — flash Props + FlashMessages 挿入（Fragment ラッパー追加）
- [x] `InquiryInputPage` — flash Props + FlashMessages 挿入
- [x] `YourPage` — flash Props + FlashMessages 挿入

### Controller（`flash: flash.to_h` 追加）
- [x] `creator_controller.rb` — `create`（初期・バリデーション失敗）、`edit` アクション
- [x] `heir_controller.rb` — `heir_show`（両分岐）、`heir_edit`
- [x] `index_controller.rb` — `index`、`search_user`
- [x] `inquiry_controller.rb` — `input_page`、`send_inquiry` の re-render
- [x] `match_controller.rb` — `appeal_check`、`matching_list_view`
- [x] `my_page_controller.rb` — `my_page`、`show`、`update` の re-render
- [x] `user_controller.rb` — `regist`、`create`（失敗）、`password_forgot`、`email_exist`（全 render）、`password_edit`
- [x] `your_page_controller.rb` — `creator_show`、`heir_show`

### ERB（flash.each 削除）
- [x] `creator/create.html.erb`
- [x] `creator/update.html.erb`
- [x] `creator/upload_image.html.erb`
- [x] `heir/heir.html.erb`
- [x] `heir/show.html.erb`
- [x] `heir/update.html.erb`
- [x] `index/index.html.erb`
- [x] `index/search_user.html.erb`
- [x] `inquiry/input_page.html.erb`
- [x] `match/appeal_show.html.erb`
- [x] `match/matching.html.erb`
- [x] `my_page/my_page.html.erb`
- [x] `my_page/update.html.erb`
- [x] `user/password_forgot.html.erb`
- [x] `user/password_reset.html.erb`
- [x] `user/regist.html.erb`
- [x] `your_page/heir_page.html.erb`
- [x] `your_page/your_page.html.erb`

---

## Phase 2: Flash 移行 — gallery 系 ✅

### TSX
- [x] `GalleryUploadPage` — flash Props + FlashMessages 挿入
- [x] `GalleryViewPage` — flash Props + FlashMessages 挿入
- [x] `HeirFavoriteGalleryPage` — flash Props + FlashMessages 挿入
- [x] `MyGalleryPage` — flash Props + FlashMessages 挿入
- [x] `SelectedGalleryPage` — flash Props + FlashMessages 挿入（Fragment ラッパー追加）
- [x] `FavoriteGalleryPage` — flash Props + FlashMessages 挿入
- [x] `UserGalleryViewPage` — flash Props + FlashMessages 挿入
- [x] `GallerySearchPage` — flash Props + FlashMessages 挿入

### Controller
- [x] `gallery_controller.rb` — 全 `@page_props` に `flash: flash.to_h` 追加
  - `favorite_gallery`, `my_gallery`, `user_view`, `selected_gallery`, `search_user_tag`, `heir_favorite_gallery`

### ERB（flash.each 削除）
- [x] `gallery/favorite_gallery.html.erb`
- [x] `gallery/my_gallery.html.erb`
- [x] `gallery/user_gallery_view.html.erb`
- [x] `gallery/upload.html.erb`
- [x] `gallery/selected_gallery.html.erb`
- [x] `gallery/gallery_search_user_tag.html.erb`
- [x] `gallery/heir_favorite_gallery.html.erb`
- [x] `gallery/view.html.erb`

### mount ファイル（fallbackProps に `flash: {}` 追加）
- [x] 全 mount*.tsx ファイル（30 ファイル）に `flash: {}` を追加
- [x] `CreatorUpdatePage` の fallback に `artCategoryId: 0` を追加
- [x] `YourPage` の fallback に `isOwnPage`, `isCreator`, `isMatched`, `targetUserId` を追加
- [x] `IndexPage` の `FlashMessages` import パス修正（`./` → `../`）

---

## Phase 3: 残 ERB の整理・確認 ✅

全ページの React 化が完了し、削除安全を確認。

- [x] `diary/good.js.erb` — 移行済コメントのみ、削除済
- [x] `diary/_diary_good.html.erb` — 移行済コメントのみ、削除済

---

## Phase 4: .erb 一括削除 ✅

53 ファイルを削除。以下のみ残存（永続保持）:

- `app/views/layouts/application.html.erb`
- `app/views/layouts/mailer.html.erb`
- `app/views/layouts/mailer.text.erb`
- `app/views/gmail_mailer/*.erb`（メールテンプレート）

| ファイル | 対応 TSX | 状態 |
|---|---|---|
| `admin/admin_create.html.erb` | `AdminCreatePage` | 削除候補 |
| `admin/admin_login.html.erb` | `AdminLoginPage` | 削除候補 |
| `admin_edit/admin_diary_comment_edit.html.erb` | `AdminDiaryCommentEditPage` | 削除候補 |
| `admin_edit/admin_diary_edit.html.erb` | `AdminDiaryEditPage` | 削除候補 |
| `admin_edit/admin_gallery_edit.html.erb` | `AdminGalleryEditPage` | 削除候補 |
| `admin_edit/admin_index.html.erb` | `AdminIndexPage` | 削除候補 |
| `admin_edit/admin_inquiry_edit.html.erb` | `AdminInquiryEditPage` | 削除候補 |
| `admin_edit/admin_user_edit.html.erb` | `AdminUserEditPage` | 削除候補 |
| `admin_edit/inquiry_detail.html.erb` | `AdminInquiryDetailPage` | 削除候補 |
| `admin_edit/selected_user_edit.html.erb` | `AdminSelectedUserEditPage` | 削除候補 |
| `certify/certify.html.erb` | `CertifyPage` | 削除候補 |
| `creator/show.html.erb` | `CreatorShowPage` | 削除候補 |
| `creator/upload_image.html.erb` | `CreatorUploadImagePage` | 削除候補 |
| `diary/_diary_good.html.erb` | ― | partial、要確認 |
| `errors/error_404.html.erb` | `Error404Page` | 削除候補 |
| `errors/error_500.html.erb` | `Error500Page` | 削除候補 |
| `match/appealed_list.html.erb` | `AppealedListPage` | 削除候補 |
| `match/scout_check.html.erb` | `ScoutCheckPage` | 削除候補 |
| `match/scout_show.html.erb` | `ScoutShowPage` | 削除候補 |
| `message/message.html.erb` | `MessagePage` | 削除候補 |
| `message/message_list.html.erb` | `MessageListPage` | 削除候補 |
| `user/email_certified.html.erb` | `EmailCertifiedPage` | 削除候補 |

---

## Phase 5: 残ページ Flash 移行

### 今回完了 ✅
- [x] `AppealedListPage` — flash Props + FlashMessages 挿入
- [x] `ScoutCheckPage` — flash Props + FlashMessages 挿入
- [x] `MessageListPage` — flash Props + FlashMessages 挿入
- [x] `MessagePage` — flash Props + FlashMessages 挿入
- [x] `match_controller.rb` — `appealed_list_view`, `scouted_show` に `flash: flash.to_h` 追加
- [x] `message_controller.rb` — `view`（2分岐）, `get_history`（2分岐）に `flash: flash.to_h` 追加

### 未完了（次回以降）

#### ユーザー向けページ
- [x] `EmailCertifiedPage` — flash Props + FlashMessages 挿入
- [x] `user_controller.rb` — `email_certified_show` に `flash: flash.to_h` 追加
- [x] `CreatorShowPage` — flash Props + FlashMessages 挿入
- [x] `creator_controller.rb` — `show`（else 分岐）に `flash: flash.to_h` 追加
- [x] `ScoutShowPage` — flash Props + FlashMessages 挿入（TSX 側のみ。コントローラ `scout_check` は `@page_props` 未整備のため別途対応）
- [x] `match_controller.rb` — `scout_check` アクション: `@page_props` + `render :scout_show` 実装（SQL バグ修正含む）
- [x] `AdminLoginPage` — flash Props + FlashMessages 挿入
- [x] `admin_controller.rb` — `login`・`login_challenge` に `@page_props = { flash: flash.to_h }` 追加
- [x] `AdminUserEditPage` — flash Props + FlashMessages 挿入
- [x] `admin_edit_controller.rb` — `user` アクションに `flash: flash.to_h` 追加
- [ ] `CertifyPage` — プレースホルダーのため flash 不要（スキップ）
- [ ] `CreatorUploadImagePage` — プレースホルダーのため flash 不要（スキップ）
- [ ] `Error404Page` / `Error500Page` — flash 不要（スキップ）

#### 管理画面ページ（admin 系）
- [x] `AdminCreatePage` — flash Props + FlashMessages 挿入
- [x] `admin_controller.rb` — `create`・`create_user`（失敗）に `flash: flash.to_h` 追加
- [x] `AdminLoginPage` — flash Props + FlashMessages 挿入 ✅（前回完了）
- [x] `AdminUserEditPage` — flash Props + FlashMessages 挿入 ✅（前回完了）
- [x] `admin_edit_controller.rb` — `user` アクション ✅（前回完了）
- [x] `AdminDiaryEditPage` — flash Props + FlashMessages 挿入
- [x] `AdminDiaryCommentEditPage` — flash Props + FlashMessages 挿入
- [x] `AdminGalleryEditPage` — flash Props + FlashMessages 挿入
- [x] `AdminInquiryEditPage` — flash Props + FlashMessages 挿入
- [x] `AdminInquiryDetailPage` — flash Props + FlashMessages 挿入
- [x] `AdminSelectedUserEditPage` — flash Props + FlashMessages 挿入
- [x] `admin_edit_controller.rb` — `diary`, `diary_comment`, `gallery`, `inquiry`, `inquiry_detail_show`, `user_edit_show` に `flash: flash.to_h` 追加
- [x] `AdminIndexPage` — props なし・flash 不要（スキップ）

## Phase 5 完了 ✅

全ユーザー向けページ・全管理画面ページへの Flash 移行が完了。

---

## Phase 6: flash 漏れ最終チェック ✅

全コントローラの `@page_props` ブロックを機械的にスキャンし、`flash:` キーが抜けていた 2 箇所を修正。

- [x] `heir_controller.rb` — `heir_show` else 分岐（既存後継者情報表示）に `flash: flash.to_h` 追加
- [x] `index_controller.rb` — `search_user` アクションに `flash: flash.to_h` 追加
- [x] 全コントローラ `@page_props` ブロック スキャン → 漏れ 0 件 確認

---

## Phase 7: 不要ルート削除 ✅

`routes.rb` から存在しないアクション・コメントアウト中の機能に対応するルートを削除。

- [x] `get 'diary/show'` — アクション未指定の不要ルート（`/diary/show/:id` は別途残す）を削除
- [x] `post 'creator/upload'` — `creator#upload` アクションがコメントアウト中のため削除
- [x] `post 'admin/inquiry/detail/:id' => 'admin_edit#inquiry_detail'` — `inquiry_detail` アクション未定義のため削除（`inquiry_detail_check` が正式ルート）

---

## Phase 8: プレースホルダー削除・ルート整理 ✅

未実装のプレースホルダーコンポーネントと不要ルートを削除。

- [x] `CertifyPage/` ディレクトリ削除（`CertifyPage.tsx`, `mountCertifyPage.tsx`, `index.ts`）
- [x] `CreatorUploadImagePage/` ディレクトリ削除（`CreatorUploadImagePage.tsx`, `mountCreatorUploadImagePage.tsx`, `index.ts`）
- [x] `application.ts` から `mountCertifyPage`・`mountCreatorUploadImagePage` の import を削除
- [x] `routes.rb` から `get 'your_page/your_page'`（`your_page#your_page` アクション未存在）を削除

---

## Phase 9: デッドコード削除 ✅

- [x] `creator_controller.rb` — `data`/`upload`/`delete`/`image_params` のコメントアウトブロック（計4つ）を削除

---

## 全フェーズ完了 🎉

Rails ERB → React (TSX) 完全移行プロジェクト、全作業完了。
