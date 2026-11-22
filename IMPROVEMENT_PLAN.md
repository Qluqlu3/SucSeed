# SucSeed 改善計画

過去の改修（IMPROVEMENT_PLAN_2.md / REFACTORING_CHECKLIST.md / SCSS_TO_TAILWIND_PLAN.md）はすべて完了済み。
このファイルは **次に取り組む課題** の一覧。優先度順。

---

## 優先度マップ

| 優先度 | 項目 | ファイル / 対象 | 工数 | 状態 |
|:------:|------|----------------|:----:|:----:|
| 🔵 計画 | フロントを Next.js（`web/`）へ移し、Rails を API 専用にする | 全画面 | L | 段階2 着手 |
| 🟡 中 | メッセージ送信・スレッド作成にマッチング成立の確認が無い | `MessageController` / `Api::V1::Message*` | S | 未着手 |
| 🟢 低 | HTML のフィードもページネーションする | 日記/ギャラリーの各ページ | M | 未着手 |
| 🟢 低 | 使われていない 500 画面（`render_500`・`errors/error_500`）の整理 | `ApplicationController` | S | 未着手 |
| 🟢 低 | コメント投稿の二重送信防止 | `DiaryCard` / `SelectedGalleryPage` | S | 未着手 |
| 🟢 低 | フロントの未使用の `api.*` の整理（`calcAge`/`timeAgo` の重複は解消済み） | `packages/api/` | S | 未着手 |

工数: S = 30分以内 / M = 半日程度 / L = 複数日

---

## 詳細

### 🔵　Next.js への移行

**方針**（2026-11 決定）: Next.js を同一ドメインで配信し、`/api/*` と未移行の画面は
`rewrites` で Rails に中継する。URL のパスは今と同じに保つ（メールのリンク・`/uploads/...`・
画面内リンクを変えずに済む）。管理画面も移す。検索エンジン対策・OGP は最後に足す。

| 段階 | 内容 | 状態 |
|---|---|:---:|
| 0-1 | `web/` の骨組みと Rails への中継。Lint・型チェック・ビルドを CI に載せる | 完了 |
| 0-2 | 開発の入口を Next にする（`bin/dev`・docker compose で Next を 3000、Rails を 3001 へ） | 完了 |
| 0-3 | `frontend/api` の型とクライアントを `frontend/` と `web/` の共有パッケージにする | 完了 |
| 0-4 | 本番の構成（Next のイメージ・配置・`RAILS_ORIGIN`）。配信先の決定が先 | |
| 1 | API が既にある画面を移す（マッチ・アピール/スカウト・メッセージ・日記/ギャラリー・職人/後継者のページ・マイページ） | 完了 |
| 2 | API が無い画面は API を足してから移す（会員登録・メール認証・パスワード再設定、詳細プロフィール、お問い合わせ、トップ・マップ・検索、お気に入りフィード） | 2-2 完了 |
| 3 | 管理画面（`/api/v1/admin/*` を作ってから） | |
| 4 | Rails の HTML 側（ビュー・レイアウト・Propshaft・jsbundling・Tailwind・HTML 側コントローラ）を撤去し `api_only` に | |
| 5 | 公開ページをサーバー側で描画し `generateMetadata` を付ける | |

`flash`・未ログイン時のリダイレクトは 1-1、404 は 1-3 で作った（下記）。

**段階1の進み具合**

| 画面 | Rails | 状態 |
|---|---|:---:|
| マッチング一覧 `/match/matching/list` | `MatchController#matching_list_view` | 1-1 完了 |
| アピール/スカウトの一覧（4画面） | `MatchController` | 1-2 完了 |
| メッセージ一覧・メッセージ | `MessageController` | 1-3 完了 |
| 日記（5画面） | `DiaryController` | 1-4 完了 |
| ギャラリー（5画面 + タグ検索） | `GalleryController` | 1-5 完了 |
| 職人/後継者のページ・マイページ（表示・変更） | `YourPageController`・`MyPageController` | 1-6 完了 |

移した画面の Rails 側（コントローラ・テンプレート・`frontend/` のコンポーネント・HTML のテスト）は、
本番がまだ Rails だけで配信しているので消さずに残し、段階4でまとめて撤去する。
開発時は Next のページが優先され、Rails 側には届かない。

1-1 で作った仕組み:

- **共有パッケージ `packages/ui`（`@sucseed/ui`）**: Navbar・Footer・ログインモーダル・セッション取得・
  `FlashMessages`・`MatchUserList`・`PostForm`・日付の関数を `frontend/` から移し、Rails と Next の
  両方で同じ部品を使う。Tailwind のテーマとプロジェクト固有のクラスも `styles/sucseed.css` に移し、
  両方の Tailwind が読み込む（Next は `@tailwindcss/postcss`、Tailwind は Rails と同じ 4.3.0）
- **CSRF トークン**: `getCsrfToken()` を `@sucseed/api` に寄せた。meta タグがあればそれ、
  `refreshSession()` 後はセッション API のトークンを返すので、Next の画面からも Rails の
  HTML フォーム（ログイン・ログアウト）へ POST できる
- **レイアウト**: `web/app/AppShell.tsx`。セッションを1回取得して `useSession()` で配る
- **ログイン必須**: `useRequireLogin()`。未ログインなら Rails と同じく `/index` へ移し
  「ログインしてください」を出す。API が 401 を返したときも同じ（`redirectToLogin()`）
- **flash**: Rails の flash は Rails のセッションにあり Next から読み書きできないため、
  ブラウザ側（`sessionStorage`）に積む `pushFlash()` を作った。表示は `PendingFlash` がナビバーの下に重ねて
  1回だけ出し、Next のレイアウトと Rails のレイアウト（`spa-flash` の island）の両方に置いた。
  逆向き（Rails が flash を積んで Next の画面へリダイレクトする）は今は無い。必要になったら
  セッション API で flash を返すなどを考える

確認済み（e2e 用の別 DB で Rails 3001 + Next 3000 を立て、ヘッドレス Chromium で操作）:
未ログインで開くと `/index` に移りメッセージが出る、モーダルからログイン、一覧の表示が Rails 版と
見た目まで一致、「メッセージ」で相手に追加して `/message/list` へ、画面を開いた後に追加済みになった相手では
Rails の画面に「追加済み」が1回だけ出る、Next の画面からログアウト。

1-2 で移した画面と、Rails との違い:

| 画面 | 誰が | API |
|---|---|---|
| `/match/appealed/list` アピールリスト | 職人 | `GET /api/v1/appeals`、回答は `PATCH /api/v1/appeals/:heirId` |
| `/match/appeal/list_check` アピール確認 | 後継者 | `GET /api/v1/appeals` |
| `/match/scouted/list` スカウト確認 | 後継者 | `GET /api/v1/scouts`、回答は `PATCH /api/v1/scouts/:creatorId` |
| `/match/scout/list_check` スカウト一覧 | 職人 | `GET /api/v1/scouts` |

- 一覧の取得・相手への変換は `web/lib/matches.ts` に寄せ、マッチング一覧（1-1）もこれを使うようにした
- ロールの制限は `useRequireRole()`。Rails の `require_creator` / `require_non_creator` と同じく、
  合わなければメッセージ無しで `/index` へ
- 回答（「話してみる」「ごめんなさい」）は Rails では POST → 同じ画面へリダイレクトして flash だったが、
  Next では API で回答し、回答した行を一覧から外して見出しの下に「保存しました」を出す（失敗は「エラーが発生しました」）。
  ボタンは `@sucseed/ui` の `AnswerButtons` を `onAnswer` を渡す形でも使えるようにして見た目を共用した
- `GET /api/v1/appeals` は後継者には回答済みも返すが、Rails の「アピール確認」は未回答だけを出していたので
  画面側で `isOk === null` に絞った（API は変えていない）

確認済み（1-1 と同じ e2e 用の別 DB と Next 3000 + Rails 3001、ヘッドレス Chromium）: 未ログイン・ロール違いで
`/index` へ、後継者のアピール確認に回答済みが出ない、職人がアピールに「話してみる」「ごめんなさい」で行が消え
マッチング一覧に反映、後継者がスカウトに回答すると職人のスカウト一覧が「マッチング成立」になる、
スカウト一覧の見た目が Rails 版と一致。

1-3 で移した画面と、Rails との違い:

| 画面 | API |
|---|---|
| `/message/list` メッセージ一覧 | `GET /api/v1/message_threads` |
| `/message/history/:id` メッセージ | `GET /api/v1/message_threads/:id`、送信は `POST /api/v1/message_threads/:id/messages`、自分のアバターは `GET /api/v1/profile` |

- 左の相手一覧と枠は `web/app/message/_components/MessageFrame.tsx` で2画面共用。Rails は相手を選ぶと
  フォームで `POST /message/history/:id` していたが、Next ではリンク（クライアント側の遷移）にした
- 履歴は Rails と同じく全件を古い順に出す。API は直近から 100 件ずつのページなので、全ページを読んで
  並べ直す（`web/lib/messages.ts` の `fetchWholeThread`）。一覧の全ページ取得は `web/lib/pagination.ts` に一般化し、
  マッチ系の一覧もこれを使う
- 送信は Rails ではリダイレクトで画面ごと読み直していたが、Next では送ったメッセージを末尾に足す。
  失敗（空文字など）は「エラーが発生しました」を出し、入力は消さない
- **404**: `web/app/not-found.tsx` を Rails の `errors/error_404` と同じ見た目で作った。API が `not_found` を返したら
  画面から `notFound()` を呼ぶ。ただしクライアント側で判定するので HTTP のステータスは 200 のまま
  （Rails は 404）。公開ページをサーバー側で描画する段階5で、ステータスも 404 にする

確認済み（同じ e2e 用の別 DB とヘッドレス Chromium）: 未ログインで `/index` へ、120 件の履歴が2ページを
またいで古い順に並び最下部までスクロールされる、送信して末尾に出て再読み込み後も残る、空送信でエラー、
左の一覧から別の相手へ移る、存在しない ID で 404 の画面、マッチング一覧の「メッセージ」から Next の
`/message/list` に相手が増えて出る、メッセージ画面と 404 の見た目が Rails 版と一致。

1-4 で移した画面と、Rails との違い:

| 画面 | 誰が | API |
|---|---|---|
| `/diary/view` 日記（自分 + お気に入り） | ログイン中 | `GET /api/v1/diaries` |
| `/diary/heir/favorite` 同上（後継者メニューから） | ログイン中 | `GET /api/v1/diaries` |
| `/diary/my_diary` マイ日記 | ログイン中 | `GET /api/v1/diaries?user_id=自分`、投稿は `POST /api/v1/diaries` |
| `/diary/post` 日記投稿 | 職人 | `POST /api/v1/diaries` |
| `/diary/show/:id` :id の人の日記 | 誰でも | `GET /api/v1/users/:id`（新規）・`GET /api/v1/diaries?user_id=:id` |

- **API を1つ足した**: `GET /api/v1/users/:id`（`Api::V1::UsersController`・`PublicUserPageSerializer`）。
  :id の人の名前と、職人の詳細プロフィールを登録済みか（`hasCreatorProfile`。Rails の `Creator.exists?` と同じ判定で、
  職人ページへのタブを出すかに使う）を返す。creators / heirs は詳細プロフィールを登録した人しか引けないため。
  ギャラリーの `/gallery/view/:id` でも使う予定
- 日記カード `DiaryCard` と職人ページのタブ `CreatorProfileTabs` を `@sucseed/ui` へ移し、Rails と Next で共用する
- ログイン中の自分（コメント欄のアバター・名前、自分の投稿かの判定）は `GET /api/v1/profile` から取る（`useCurrentUser`。1-5 で `web/lib/users.ts` へ移した）
- 日記投稿（`/diary/post`）は Rails では失敗してもマイ日記へ移っていたが、Next では入力を残したまま画面にエラーを出す。
  成功時は Rails と同じく「保存しました」を出してマイ日記へ移る
- `DiaryCard` のいいねした人のアバターが画像パスを key にしていて、既定のアバターの人が2人いると key が重複していた
  （Rails 版にもあった）。並び順で key を付けるよう直した

確認済み（同じ e2e 用の別 DB とヘッドレス Chromium、職人の日記 15 件で API の2ページをまたぐ）: 未ログインで
フィードは `/index` へ、未ログインでも `/diary/show/:id` は見られタブが出る、存在しない ID で 404、
後継者のフィードに自分 + お気に入りの 16 件、いいね・コメント、後継者の日記にはタブが出ない、後継者が `/diary/post` を開くと `/index` へ、
空投稿でエラー、投稿してマイ日記へ移り「保存しました」、マイ日記の右のフォームから投稿・削除（再読み込み後も消えている）、
`/diary/show/:id` の見た目が Rails 版と一致。

1-5 で移した画面と、Rails との違い:

| 画面 | 誰が | API |
|---|---|---|
| `/gallery/view/:id` :id の人のギャラリー | 誰でも | `GET /api/v1/users/:id`・`GET /api/v1/galleries?user_id=:id` |
| `/gallery/user/search/tag/:id?search_tag=` タグ検索の結果 | 誰でも | `GET /api/v1/galleries?user_id=:id&tag=` |
| `/gallery/selected/:id` 作品の詳細 | 誰でも | `GET /api/v1/galleries/:id`、いいね・コメントは既存の API |
| `/gallery/my_gallery` マイギャラリー | ログイン中 | `GET /api/v1/galleries?user_id=自分`、投稿は `POST /api/v1/galleries` |
| `/gallery/favorite` ギャラリー（自分 + お気に入り、投稿フォーム付き） | ログイン中 | `GET /api/v1/galleries`・`POST /api/v1/galleries` |
| `/gallery/heir/favorite` 同上（後継者メニューから、投稿フォーム無し） | ログイン中 | `GET /api/v1/galleries` |

- API は足していない（1-4 の `GET /api/v1/users/:id` を見出しの名前に使った）
- サムネイル `GalleryCard`・投稿フォーム `GalleryUploadForm`・作品詳細 `SelectedGalleryPage`・`ErrorBoundary` と
  Three.js の 3D ビューワー（`frontend/three` → `packages/ui/three`）を `@sucseed/ui` へ移し、Rails と Next で共用する。
  `three` と `@types/three` の依存もルートから `packages/ui` へ移した。Rails 側のバンドルでも Three.js は別チャンクのまま
- 全件取得のフックを `useAllPages()`（`web/lib/pagination.ts`）に一般化し、日記の `useAllDiaries` もこれを使う。
  `useCurrentUser` と、:id の人を引く `usePublicUser` は `web/lib/users.ts` にまとめた
- **タグ検索**: Rails はフォームの `POST /gallery/user/search/tag/:id` で結果の画面を返していたが、Next のページは GET でしか
  開けないので、同じパスに `?search_tag=` を付けて移る。空のまま送ると何もしない（Rails も 204 で画面が変わらなかった）。
  クエリが無いまま開いたらその人のギャラリーへ移す
- タグ検索の結果は Rails ではいいね数を数えておらず 0 と出ていた。API は数えるので正しい数が出る。
  並びも Rails は順不同だったが、API は新しい順
- `/gallery/view/:id` の職人ページへのタブは Rails と同じく常に出す（日記の画面と違い、詳細プロフィールの有無を見ていなかった）
- 存在しないユーザー・作品は 404 の画面（1-3 と同じく HTTP のステータスは 200）

確認済み（同じ e2e 用の別 DB とヘッドレス Chromium、職人の作品 30 件で API の2ページをまたぐ）: 未ログインでマイギャラリー・
フィード2画面は `/index` へ、未ログインでも `/gallery/view/:id` は 30 件とタブが出る、タグ検索で 15 件・該当なしで「検索結果なし」・
クエリ無しでその人のギャラリーへ、作品の無い人は「まだありません」で検索欄が出ない、存在しない ID で 404（ユーザー・作品とも）、
作品詳細で職人情報・その他の投稿・3D プレビューの canvas が出て、未ログインはいいねが押せずコメント欄に「ログインしてください」、
後継者のフィードに 30 件、後継者が投稿すると「この操作を行う権限がありません」、後継者のいいね（1→2）とコメントが再読み込み後も残る、
職人が画像無しで投稿すると「画像を選択してください」、画像とタグ付きで投稿すると先頭に出て再読み込み後も 31 件、
`/gallery/view/:id`・`/gallery/selected/:id` の見た目が Rails 版と一致。

1-6 で移した画面と、Rails との違い:

| 画面 | 誰が | API |
|---|---|---|
| `/page/creator/:id` 職人ページ | 誰でも | `GET /api/v1/creators/:id`、お気に入りは `/api/v1/favorites`、アピールは `POST /api/v1/appeals` |
| `/page/heir/:id` 後継者ページ | 誰でも | `GET /api/v1/heirs/:id`（変更）、スカウトは `POST /api/v1/scouts` |
| `/my_page/my_page` マイページ | ログイン中 | `GET /api/v1/profile` |
| `/my_page/update` プロフィール変更 | ログイン中 | `GET /api/v1/profile`、変更は `PATCH /api/v1/profile`（multipart） |

- **`GET /api/v1/heirs/:id` を変えた**: 後継者は「職人でないユーザー」で、詳細プロフィール（heirs）が未登録でも
  アピールでき、職人のアピールリストから `/page/heir/:id` へ飛べる。Rails の画面は開けたが API は heirs の行が無いと
  404 だったので、行が無くても返す（`artCategoryId` / `artCategoryName` / `introduction` が null）。職人の :id は 404。
  入力が Heir から User になったので `HeirSerializer` も User を受け取る形にした（フロントの利用者はまだ無かった）
- **`isScouted` の判定を Rails に揃えた**: API はスカウトだけを見ていたが、matches は2人の組で一意なので、
  後継者からアピールを受けた職人もスカウトを送れない（一意制約で弾かれる）。Rails と同じく、どちらかの行があれば true
- API のテストが無かった `heirs` にテストを足した。テスト 368 件 → 374 件
- `:id` で1件を取って not_found なら 404 にする処理（`usePublicUser`・作品詳細）を `useResource()`（`web/lib/resource.ts`）にまとめ、
  職人/後継者のページもこれを使う
- 職人ページで詳細プロフィールの無い人・存在しない人は 404 の画面（Rails はトップへ移していた）。後継者ページで職人の :id も 404
  （Rails は後継者ページとして出していた）
- プロフィール変更は Rails と同じく名前・メール・紹介文・アバターを1回で送る（`api.profile.updateWithAvatar` を足した）。
  成功は「保存しました」を出してマイページへ。失敗は Rails と同じくエラーの一覧と「エラーが発生しました」を出し、入力は残す
- マイページの生年月日は Rails では `new Date("YYYY-MM-DD")`（UTC として解釈）からローカル時刻で日付を出しており、
  日本より西のタイムゾーンでは1日ずれていた。文字列を分けて出すようにした
- 背景画像（`main1.jpg`）は Rails 版と同じファイルを `app/assets/images/` から import した

確認済み（同じ e2e 用の別 DB とヘッドレス Chromium）: 未ログインで職人/後継者のページは見られボタンが出ない、
後継者の :id の職人ページ・職人の :id の後継者ページ・存在しない :id で 404、詳細プロフィール未登録の後継者のページが開く、
後継者がお気に入りの登録・解除とアピール（再読み込み後も残る）、アピールした後継者を職人が見ると「スカウト済み」、
別の職人がスカウトして再読み込み後も「スカウト済み」、自分の職人ページにお気に入り・アピールが出ない、募集停止中の表示、
未ログインでマイページ・プロフィール変更は `/index` へ、ロール別の歯車メニュー、名前を空にして変更するとエラー2件、
名前・紹介文・アバターを変更して「保存しました」とマイページに反映、職人ページの見た目が Rails 版と一致。

残り: Next の画面に favicon が無い（Rails はダイジェスト付きのアセットを `favicon_link_tag` で出している）。
Sentry も Next 側は未設定。一覧は API を全ページ読んで全件出している（Rails の画面と同じ。🟢-1 と合わせて
ページ送りにするか決める）。

**段階2の進み具合**

| 画面 | Rails | 状態 |
|---|---|:---:|
| 職人/後継者の詳細プロフィール（参照・登録・変更） | `CreatorController`・`HeirController` | 2-1 完了 |
| 会員登録・メール認証・パスワード再設定 | `UserController` | 2-2 完了 |
| お問い合わせ | `InquiryController` | |
| トップ・マップ・検索 | `IndexController`・`MapController` | |
| お気に入りフィード | | |

2-1 で足した API と移した画面:

| 画面 | 誰が | API |
|---|---|---|
| `/creator/show` 制作者情報（未登録なら登録フォーム） | 職人 | `GET /api/v1/profile/creator`（新規）、登録は `POST /api/v1/profile/creator`（新規） |
| `/creator/edit` 制作者情報の変更 | 職人 | `GET`・`PATCH /api/v1/profile/creator`（新規） |
| `/heir/show` 後継者情報（未登録なら登録フォーム） | 職人以外 | `GET /api/v1/profile/heir`（新規）、登録は `POST /api/v1/profile/heir`（新規） |
| `/heir/edit` 後継者情報の変更 | 職人以外 | `GET`・`PATCH /api/v1/profile/heir`（新規） |

- **API**: `Api::V1::ProfileCreatorsController`・`ProfileHeirsController`。表現は職人/後継者のページと同じ
  `CreatorSerializer`・`HeirSerializer` を使う。テスト 374 件 → 388 件
- **二重登録を弾く**: creators / heirs には user_id の一意制約が無く、Rails の登録は二重送信で2行目を作れた。
  API は登録済みなら 409。DB に一意制約を足すかは、既存データに重複が無いかを本番で確かめてから決める
- **後継者の詳細プロフィールは職人以外だけ**: Rails の `/heir/show` は `require_login` だけで、職人でも登録フォームが出て登録できた
  （職人のロールは `is_creator` で決まるので画面上は何も変わらず、heirs に行だけが残る）。API・画面とも職人は弾く
- 失敗時は入力を残してエラーの一覧を出す。Rails は変更の失敗で入力を捨てて変更画面へ戻し、後継者の登録の失敗は
  「エラーが発生しました」だけで理由を出していなかった
- 後継者が登録するとロールが `user` → `heir` に変わりナビバーのメニューも変わるので、成功後は画面を読み込み直す
- 歯車メニューを `web/app/_components/ProfileMenu.tsx` に移し、マイページ・プロフィール変更と同じ項目に揃えた
  （Rails はマイページで職人に「プロフィール詳細変更」が無く、後継者の詳細画面だけ「プロフィール詳細一覧」だった）
- 文言の誤字を直した: 「兴味のある分野」→「興味のある分野」、「半角数字ハイフンなび7文字」→「ハイフンなし」
- `GET /creator/create`（Rails は GET でも `create` を呼び、パラメータが無いので 400）は移していない。どこからもリンクされていない
- 残り: 分野を選ばないと「Art categoryを入力してください」「Art categoryを選択してください」の2件が出る（Rails 版も同じ）。
  `belongs_to :art_category` の必須エラーの属性名が翻訳されていないのと、`Heir` は自前の presence と二重になっているため

確認済み（同じ e2e 用の別 DB とヘッドレス Chromium）: 未ログインで4画面とも `/index` へ、職人が `/heir/show`・後継者が
`/creator/show` を開くとトップへ、職人の参照・歯車メニューから変更画面・不正な入力でエラー3件と入力が残る・変更して
「保存しました」と反映（募集停止中・都道府県の変わる郵便番号）、未登録の職人が `/creator/edit` を開くと登録フォームへ・
空で登録してエラー・登録して参照画面とマイページの「詳細情報登録」の案内が消える、後継者の参照・変更・分野未選択でエラー、
未登録の後継者が登録してロールが `user` → `heir`、`/heir/show` の見た目が Rails 版と一致。

2-2 で足した API と移した画面（どれも未ログインで使う）:

| 画面 | API |
|---|---|
| `/user/create` 会員登録 | `POST /api/v1/registration`（新規。アバター画像を付けられるよう multipart） |
| `/user/password_forgot` 再設定のメールを送る | `POST /api/v1/password_resets`（新規） |
| `/user/password_reset/:token` 新しいパスワード | `GET`・`PATCH /api/v1/password_resets/:token`（新規） |
| `/email/certified/:token` メールアドレス認証 | `GET`・`PATCH /api/v1/email_verifications/:token`（新規） |

- **API**: `Api::V1::RegistrationsController`・`PasswordResetsController`・`EmailVerificationsController`。
  リンクが無効なら 404（`invalid_token`）で、`message` に Rails の flash と同じ文言を入れて画面がそのまま出す。
  テスト 388 件 → 413 件
- **メールのリンクは変えていない**: メーラーは今の名前付きルート（`email_certified_url`・`password_reset_url`）のまま。
  パスも同じなので、開発では Next、本番（まだ Rails だけ）では Rails の画面が開く
- **空のパスワードで「変更しました」になっていた**: `has_secure_password` は空文字を「変更なし」として黙って無視するので、
  Rails 版は空のまま送ると何も変えずに成功を出し、そのリンクも使えるまま残っていた。API は 422 にする
- **会員登録に IP 単位の制限を足した**: 登録すると認証メールを送るのに制限が無く、メールの大量送信の踏み台にできた。
  HTML の `/user/create` と API を合わせて同一 IP から 10回/時。再設定のメール送信・メールアドレス認証の制限は
  API 側にも掛け、HTML 版とカウンタを共有する（`throttle_post` は PATCH も数えるようにした）
- 再設定のメール送信に失敗しても、API は登録済みかどうかを漏らさないよう同じ 202 を返し、`Rails.error.report` で記録する
  （Rails 版は例外を握りつぶして何も出さずにフォームへ戻していた）
- 失敗しても入力を残す（Rails 版の会員登録は入力をすべて捨てていた）。パスワード再設定のエラーの見た目を
  他のフォームと同じ `FormErrors` に揃えた
- 画像を multipart 以外で送ったときの判定（`uploaded_file?`・`render_not_multipart`）が作品投稿とプロフィールに重複していたので、
  会員登録で3つ目になる前に `Api::BaseController` にまとめた
- `useResource` の `error` に API の `code` を足した（リンク無効の `invalid_token` を他のエラーと分けるため）
- 残り: `/user/password_forgot` へのリンクがどこにも無い（ログインモーダルにも無い）。Rails 版も同じで、今回は足していない

確認済み（e2e 用の別 DB とヘッドレス Chromium。メールは本物の SMTP に送らず、起動時だけファイルに書き出して
リンクを取り出した）: 会員登録の不正な入力でエラー3件と入力が残る・2000年2月29日から年を変えると28日に寄る・
アバター付きで登録して「登録完了」とトップへ・届いたリンクで認証画面に名前が出て認証・同じリンクでもう一度押すと
「すでに認証済み」・でたらめなトークンはトップへ戻して理由を出す、登録した人でログインでき生年月日・性別・アバターが
入っている、再設定のメール送信で空欄のエラー・未登録のアドレスでも同じ文言・届いたリンクで短いパスワードと空のパスワードの
エラー・変更して「パスワードを変更しました」・同じリンクは送信画面へ戻す・新しいパスワードでログインできる、
ログインモーダルの「ユーザ登録はこちらから」から Next の画面へ、会員登録とメールアドレス確認の見た目が Rails 版と一致。

0-1 で Next（3100）経由の次の動作を確認済み: Rails のリダイレクト先が Next のホストになる
（`X-Forwarded-Host`）、アセット・アップロード画像の配信、API のログインと multipart の画像アップロード、
HTML フォームの CSRF（正しい Origin は通り、別オリジンは 422）、未定義の API は JSON の 404。
0-2 では同じ確認を docker compose（Next → `http://web:3001`）と `bin/dev` で行った。

`next dev` は AI のコーディングエージェントの環境で起動されると `web/AGENTS.md` を書き出す
（`next.config` の `agentRules: false` で止まる）。コミットするかは未決。

0-3 で型とクライアントは `packages/api`（`@sucseed/api`、ビルドせず TS のまま公開し Next は
`transpilePackages` で変換）に移した。Next の画面は Rails の `csrf-token` meta タグを持たないので、
更新系の前に `refreshSession()` でトークンを取る。サーバー側（RSC）からの呼び出しは相対パスの
`fetch` と Cookie の受け渡しが要るため未対応で、段階1で必要になったら足す。

### 🟡-A　メッセージにマッチング成立の確認が無い

`POST /message/send/:id`・`POST /api/v1/message_threads/:id/messages`・スレッド作成のいずれも
相手との関係を見ていないため、ログイン中なら任意のユーザー ID にメッセージを送れる。
「マッチング成立（`Match.accepted`）した相手とだけやり取りできる」のが仕様なら、
送信前に成立済みマッチの存在を確認する。仕様の確認が先。

実装する場合、スレッド作成は `MessageList.open_between` に集約済みなのでそこに1か所足せば
HTML・API の両方に効く（`Match.accepted.between(heir_id:, creator_id:).exists?`）。
メッセージ送信（`MessageController#send_message`・`Api::V1::MessagesController#create`）は
まだ別々なので、同じように `Message` 側へ寄せてから足す。

### 🟢-1　HTML のフィードもページネーションする

**現状**: API 側（`/api/v1/diaries` `/api/v1/galleries` など）は全てページング済みだが、
HTML のフィード（`/diary/view`、`/gallery/my_gallery` など）は全件表示のまま。

`DiaryFeedQueryService` / `GalleryFeedQueryService` は `scope_for` と `build` に
分かれているため Rails 側は `pagy` を挟むだけで済む。フロント側にページ送り UI
（既存の `Pagination` コンポーネント）を足す作業がメイン。

---

### 🟢-3　使われていない 500 画面の整理

`ApplicationController#render_500` と `errors/error_500` テンプレート（`Error500Page`）は
どこからも呼ばれておらず、表示される経路が無い（本番の 500 は `public/500.html`）。
React 版の 500 画面を出したいなら `rescue_from StandardError` か `config.exceptions_app` で
繋ぐ、不要なら3点を削除する。

---

## 完了済み（参考）

### 2026-11　管理者セッションにタイムアウトとログアウト（旧 🟡-C）

- 最終操作から 30 分（`AdminAuthentication::ADMIN_SESSION_TIMEOUT`）で切れるようにした。
  一般ユーザーの 2 時間より短い。最終操作時刻を持たない既存のセッションも期限切れとして扱う
- `POST /admin/logout` とサイドメニューのログアウトを追加。消すのは管理者のキーだけで、
  同じブラウザの一般ユーザーとしてのログインは残す
- 管理者トップが手書きで複製していたサイドメニューを `AdminSideMenu` に置き換えた
- テスト 360 件 → 364 件

### 2026-11　Next.js 移行の土台（段階 0-1〜0-3）

- `web/`（Next 16.4.2）を追加し、未移行の画面と `/api/*` を `rewrites` で Rails に中継
- 開発時の入口を Next（3000）にし、Rails を 3001 へ。docker compose・`bin/dev` の両方
- `frontend/api` を共有パッケージ `packages/api`（`@sucseed/api`）にし、`frontend/` と `web/` から
  `workspace:*` で参照。Docker イメージの `pnpm install` 用にワークスペースの定義も先にコピーする
- **API で CSRF の Origin 検査が効いていなかった**のを修正。`forgery_protection_origin_check` が
  `ActionController::API` に引き継がれず、別オリジンでもトークンが正しければ更新系が通っていた
- **docker compose の各サービスが依存を同時にインストールして壊し合う**問題を修正。
  インストールを `deps` サービスに集め、ほかはその完了を待つ。ワークスペースに `web/` を加えて以降、
  コンテナの `pnpm install` がホストの `web/node_modules` を書き換えていたのも、ボリュームに分けて解消
- テスト 357 件 → 360 件

### 2026-10　自分のプロフィールの表現を HTML / API で共通化

- **`ProfileSerializer` を追加**し、API の `GET/PATCH /api/v1/profile` と HTML のマイページ・
  プロフィール編集画面で共用。フロントのマイページも API と同じ `Profile` 型で受け取る
- 「職人/後継者の詳細プロフィールを登録済みか」の判定（HTML と API で裏返しに二重実装されていた）と
  ロールの判定を `User#detail_profile_registered?`・`User#role` に集約
- **パラメータが欠けると 500 になっていた**マイページ更新・パスワード再設定を `params.expect` に
  （`params[:user][:xxx]` の生参照が HTML 側に残っていた）
- テストの無かったマイページに HTML 側のテストを追加。テスト 347 件 → 357 件

### 2026-10　画面マウントの定型コードを一本化

画面ごとに「1行の ERB」「`mountXxx.tsx`」「`application.ts` の import」の3点が必要で、
`mountXxx.tsx` の予備 props は一度も使われない死にコードなのに型とは別に手書きされていた。

- **ERB は `react_root` ヘルパー1行に**（48 ファイル）。props の JSON は tag ヘルパーが
  属性値としてエスケープする（旧 🟢-3「`to_json` → `json_escape` 明示化」はこれで解消。
  `<%=` の自動エスケープに暗黙に頼る書き方が無くなった）
- **48 個の `mountXxx.tsx` を `frontend/pages.ts` の登録表に置き換え**、予備 props を削除
- 変更前後のテンプレート出力がバイト単位で一致すること、development / production の
  サーバーで 47 画面がマウントされることをヘッドレス Chrome で確認

### 2026-10　マッチング・メッセージのドメイン操作を集約

matches・message_lists は「後継者 / 職人」で向きが固定されたテーブルで、作成・回答・
当事者での絞り込み・メッセージ相手の追加を HTML と API がそれぞれ個別に書いていた。
片方だけ直して片方が漏れる不具合（`is_scout` の絞り忘れ、退会者の除外漏れなど）が
繰り返し出ていたため、`Match`（`appeal` / `scout` / `answer_appeal` / `answer_scout` /
`between` / `involving` / `with_active_parties` / `#partner_for`）と
`MessageList.open_between` に寄せ、両方から使うようにした。

- **アピール/スカウトの相手のロールを検証**（旧 🟡-B）。作成時に
  「user は後継者、target_user は職人」をモデルで検証する。集約したので1か所で HTML・API の両方に効く
- **退会した相手がいると API のアピール/スカウト/マッチング一覧が 500** だったのを修正
  （HTML 側だけ直っていた）
- テストの無かった HTML 側の回答（お断り・対象なし）とメッセージ相手の追加に、
  集約前にテストを追加。テスト 328 件 → 344 件

### 2026-10　Sprockets → Propshaft 移行 / Three.js の遅延読み込み

- **アセットパイプラインを Propshaft に移行**（`sprockets-rails` → `propshaft`、`manifest.js` 削除）
- **Three.js を別チャンクに分離**。`esbuild --splitting` + `React.lazy` で、ギャラリー詳細の
  3D プレビューを描くときにだけ読み込む。`application.js` 2.6MB → 1.5MB
  - 2026-08 に見送った原因（Sprockets がチャンクに独自のダイジェストを付け、動的 import の
    参照先が実在しなくなる）は、チャンクを `*-[hash].digested.js` で出力して解消。
    Propshaft は `.digested` 付きのファイルに二重のダイジェストを付けない
  - チャンクの取得に失敗しても 3D プレビュー枠内だけで扱う（`ErrorBoundary` の `fallback`）
- **画像の直書きパスを廃止**。Propshaft はダイジェスト付きのファイルしか出力しないため、
  フロントの `/assets/main1.jpg` のような参照は本番で 404 になる。esbuild の file loader で
  `import` する形にした（Tailwind の `bg-[url('/assets/...')]` は Propshaft の CSS 書き換えで
  解決できないので style 指定に）。CarrierWave の既定画像は `image_path` で解決
- 本番モードで `assets:precompile` → サーバー起動し、全アセットが 200 で返ること、
  ヘッドレス Chrome で 3D ビューワーが描画されトップの画像が表示されることを確認

### 同時に発見・修正したバグ

- **退会したユーザーのコメント・いいねがあると日記フィードとギャラリー詳細が 500**。
  `includes(:user)` だけで、投稿者が論理削除されていると `user` が nil になっていた。
  `joins(:user)` で退会者の行を落とすようにした（HTML・API 共通のサービスで修正）

### 2026-10　フロントから未使用になった HTML 投稿ルートを削除

API 移行後どこからも呼ばれていなかった次のルートと、対応するアクションを削除した。
`FavoriteController` はアクションがすべて無くなったのでファイルごと消した。

- `POST /gallery/view`、`POST /gallery/selected/good/:id`、`POST /gallery/selected/comment/:id`
- `POST /diary/show/:id/good`、`POST /diary/show/:id/comment`
- `POST /favorite/:id/add`、`POST /favorite/:id/delete`
- `POST /match/send/:id`、`POST /scout/send/:id`

この一覧の当初の記載にあった `POST /diary/post` は、`/diary/post` の投稿フォーム
（`DiaryPostPage`）の送信先として今も使われていたため残した。
Rack::Attack の HTML 側のパス指定と、それを叩いていたスロットルテストも整理した
（ギャラリー投稿だけは API 側のテストが無かったため API パスに付け替えた）。

### 2026-09　HTML 画面のマッチング・メッセージ周りのバグ修正

HTML 側の `MatchController` にテストが1件も無く、API 化の際にも HTML 側の
クエリは手付かずだったため、次の不具合がまとめて残っていた。

- **職人が自分の送ったスカウトを自分で承認できた（認可漏れ）**。matches は
  アピールもスカウトも「user_id = 後継者 / target_user_id = 職人」の同じ向きで
  格納されるのに、`POST /match/ok/:id` が `is_scout` で絞っていなかった。
  `Match.appeals` / `scouts` / `pending` / `accepted` スコープを追加し、
  HTML と API の両方をこれで絞るようにした
- **マッチング一覧（`/match/matching/list`）が常に 500**。`.or` に joins の異なる
  リレーションを渡していた
- **アピール受信一覧・スカウト受信一覧に他人宛ての行が混ざる／重複する**。
  サブクエリで相手ユーザーだけ絞り、matches 側を自分で絞っていなかった。
  4つの一覧を「自分が当事者のマッチ」から組み立てる形に書き直した
- **職人向けの「送ったスカウト一覧」が後継者向け画面のコピーのまま**だった
  （相手へのリンクが職人ページを指し、押しても必ず弾かれる OK/NG ボタンがあった）。
  後継者ページへのリンクと回答状況の表示に変更
- **職人の「後継者を募集中」チェックが常に false で保存されていた**。
  未チェック時用の hidden `"0"` がチェックボックスの後ろにあり、Rack は同名キーの
  最後の値を採るため。職人が一覧・検索・地図から消える状態だった
- **HTML のログインにメールアドレス単位のレート制限が無かった**。API にだけ掛けていたが、
  画面のログインフォームは HTML 側（`POST /user/login`）を使うため、分散総当たり対策が
  実質効いていなかった。`Authentication#limit_login_attempts_per_email` に共通化し、
  カウンタも `rate_limit` の `scope:` で両者共有にした
- 管理者ログインを `find_by` + `authenticate` から `authenticate_by` に（ID 列挙のタイミング攻撃対策）
- メッセージ送信後のリダイレクト先 `GET /message/history/:id` のルートが無く 404 だった。
  あわせて履歴を時系列順（古い→新しい）に修正
- 後継者ページの「スカウト済み」判定が逆向きの条件で、送信済みでも常に未スカウト表示だった
- アバター画像の `<img src>` に CarrierWave のオブジェクト（`{"url": ...}`）が渡り画像切れしていた
  （メッセージ画面・アピール/スカウト一覧）
- 管理画面: 問い合わせ一覧の「対応済み」が常に未対応表示（boolean を `== 1` で比較）、
  対応チェックを外して保存すると 500
- パラメータ欠落時に 500 になっていたログイン系アクションを 400 相当の応答に
- Rack::Attack の `gallery_upload` が API 経路（`POST /api/v1/galleries`）を含んでいなかった
- テストの職人/後継者ファクトリを `test/support/user_factory.rb` に切り出して HTML 側でも使えるようにした
- テスト 289 件 → 313 件

### 2026-09　本番の `cache_store` に Solid Cache を導入

- **現状の課題**: `config/environments/production.rb` の `cache_store` がコメントアウトされたまま
  Rails の既定 `:file_store`（`tmp/cache`、プロセスローカル）に落ちており、`Rails.cache` を
  カウンタ置き場にしている `Rack::Attack`（IP単位）と Rails 8 の `rate_limit`（ユーザー単位、
  [docs/API.md](docs/API.md) 参照）が複数プロセス・複数インスタンス運用で
  インスタンスごとに別カウントになる状態だった
- **Solid Cache を選択**。Redis 等の別ミドルウェアを増やさず、既存の MySQL に
  `solid_cache_entries` テーブルを1つ持つだけで済む（Rails 8 新規アプリの既定と同じ構成）
- **別データベース/別接続を作らなかった**。`bin/rails solid_cache:install` の既定は
  `config/cache.yml` に `database: cache` を生成し、`config/database.yml` 側にも
  別コネクション定義を要求するが、本アプリの本番DB接続は `DATABASE_URL` 1本のみの
  シンプルな構成。gemのREADME記載の「`database`/`databases`/`connects_to` を
  何も指定しなければ `ActiveRecord::Base` の接続プールをそのまま使う」という
  仕様を利用し、主DBに同居させる形にして新しい接続文字列やDBプロビジョニングを
  増やさずに済ませた
- テーブル定義は通常の `db/migrate` マイグレーションとして追加（gem 既定の
  `db:prepare` 前提の別スキーマファイル運用ではなく、既存の
  `db:migrate` / `db/schema.rb` 運用にそのまま乗せるため）
- `Rails.cache.write` / `read` が実際に MySQL の `solid_cache_entries` に
  読み書きすることを `bin/rails runner` で実地確認した上でコミット

### 2026-09　Rails周辺gemのメジャーアップグレード

- **pagy 9.x → 43.x**。「MAJORバージョンでのみ破壊的変更を入れる」方針のgemで、
  9系から43系まで多数のメジャーを経た完全な再設計版。実際に必要だった変更は
  `include Pagy::Backend` → `include Pagy::Method`、`Pagy::OverflowError` →
  `Pagy::RangeError`、範囲外ページで例外を送出させるための
  `Pagy::OPTIONS[:raise_range_error] = true` の3点のみ。`pagy(scope, limit: N)`
  という呼び出し自体は互換のまま使えたため、各コントローラのページネーション
  呼び出し箇所は無改修で済んだ
- **alba 3.11 → 4.0**。廃止されたAPI群(`enable_inference!`、`resource_with`等)は
  いずれも未使用であることをCHANGELOGと実装コードの両方で確認
- **sentry-rails/sentry-ruby 6.7 → 7.0**。新機能のStructured Logging(Rails の
  ログをSentry Logsとして自動送信)が既定で有効になったため、エラー
  トラッキング以外の目的でイベント送信を増やさないよう明示的に無効化
- **安全なマイナー/パッチ更新**: bootsnap, bullet, carrierwave, mini_magick,
  rubocop, selenium-webdriver, sprockets, web-console

### 同時に発見・修正したバグ

- **Rails 8.1 + image_processing 2.x の非互換によるActiveStorage起動時
  クラッシュ**。`config.load_defaults 8.1` で `active_storage.variant_processor`
  の既定値が `:vips` に変わっており、`image_processing` gem が1.14→2.1に
  上がった際のエラーメッセージ文言変更でRails側のrescue正規表現が
  マッチしなくなり、例外がそのまま再送出されて起動自体が失敗する状態に
  なっていた(`eager_load!`で再現・確認)。本アプリはActiveStorageの
  variant機能を使っていないため `variant_processor = :disabled` を明示して解消
- レート制限の設定ミスを未然に防止: `config.metrics.enabled = false`という
  存在しないAPIを使いかけたが、gemソースで検証し起動時 `NoMethodError` に
  なることを確認した上で該当コードを含めなかった

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
