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

## Phase 2: Flash 移行 — gallery 系 ☐

### TSX
- [ ] `GalleryUploadPage` — flash Props + FlashMessages 挿入
- [ ] `GalleryViewPage` — flash Props + FlashMessages 挿入
- [ ] `HeirFavoriteGalleryPage` — flash Props + FlashMessages 挿入
- [ ] `MyGalleryPage` — flash Props + FlashMessages 挿入
- [ ] `SelectedGalleryPage` — flash Props + FlashMessages 挿入
- [ ] `FavoriteGalleryPage` — flash Props + FlashMessages 挿入
- [ ] `UserGalleryViewPage` — flash Props + FlashMessages 挿入
- [ ] `GallerySearchPage` — flash Props + FlashMessages 挿入

### Controller
- [ ] `gallery_controller.rb` — 全 `@page_props` に `flash: flash.to_h` 追加
  - `favorite_gallery`, `my_gallery`, `user_view`, `selected_gallery`, `search_user_tag`, `heir_favorite_gallery`

### ERB（flash.each 削除）
- [ ] `gallery/favorite_gallery.html.erb`
- [ ] `gallery/my_gallery.html.erb`
- [ ] `gallery/user_gallery_view.html.erb`
- [ ] `gallery/upload.html.erb`
- [ ] `gallery/selected_gallery.html.erb`
- [ ] `gallery/gallery_search_user_tag.html.erb`
- [ ] `gallery/heir_favorite_gallery.html.erb`
- [ ] `gallery/view.html.erb`

---

## Phase 3: 残 ERB の整理・確認 ☐

以下は React 化済みだが flash 移行不要（またはそもそも flash がない）ファイル。
削除前に各ページの動作確認を行う。

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

## Phase 4: .erb 一括削除 ☐

> **前提**: Phase 2 gallery 完了・全ページ動作確認済みであること

- [ ] 上記 削除候補の `.erb` ファイルを削除
- [ ] gallery 系 `.erb` ファイルを削除（Phase 2 gallery 完了後）
- [ ] diary / creator / heir / index / inquiry / match / my_page / user / your_page 系 `.erb` ファイルを削除

**削除しない（永続保持）**:
- `app/views/layouts/application.html.erb`
- `app/views/gmail_mailer/*.erb`（メールテンプレート）
- `app/views/diary/_diary_good.html.erb`（partial、要確認）
