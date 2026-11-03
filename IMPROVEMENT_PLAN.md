# SucSeed 改善計画

過去の改修（IMPROVEMENT_PLAN_2.md / REFACTORING_CHECKLIST.md / SCSS_TO_TAILWIND_PLAN.md）はすべて完了済み。
このファイルは **次に取り組む課題** の一覧。優先度順。

---

## 優先度マップ

| 優先度 | 項目 | ファイル / 対象 | 工数 | 状態 |
|:------:|------|----------------|:----:|:----:|
| 🔵 計画 | フロントを Next.js（`web/`）へ移し、Rails を API 専用にする | 全画面 | L | 0-2 完了 |
| 🟡 中 | メッセージ送信・スレッド作成にマッチング成立の確認が無い | `MessageController` / `Api::V1::Message*` | S | 未着手 |
| 🟡 中 | 管理者セッションにタイムアウトとログアウトが無い | `AdminAuthentication` | S | 未着手 |
| 🟢 低 | HTML のフィードもページネーションする | 日記/ギャラリーの各ページ | M | 未着手 |
| 🟢 低 | 使われていない 500 画面（`render_500`・`errors/error_500`）の整理 | `ApplicationController` | S | 未着手 |
| 🟢 低 | コメント投稿の二重送信防止 | `DiaryCard` / `SelectedGalleryPage` | S | 未着手 |
| 🟢 低 | フロントの未使用の `api.*` の整理（`calcAge`/`timeAgo` の重複は解消済み） | `frontend/api/` | S | 未着手 |

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
| 0-3 | `frontend/api` の型とクライアントを `frontend/` と `web/` の共有パッケージにする | |
| 0-4 | 本番の構成（Next のイメージ・配置・`RAILS_ORIGIN`）。配信先の決定が先 | |
| 1 | API が既にある画面を移す（マッチ・アピール/スカウト・メッセージ・日記/ギャラリー・職人/後継者のページ・マイページ） | |
| 2 | API が無い画面は API を足してから移す（会員登録・メール認証・パスワード再設定、詳細プロフィール、お問い合わせ、トップ・マップ・検索、お気に入りフィード） | |
| 3 | 管理画面（`/api/v1/admin/*` を作ってから） | |
| 4 | Rails の HTML 側（ビュー・レイアウト・Propshaft・jsbundling・Tailwind・HTML 側コントローラ）を撤去し `api_only` に | |
| 5 | 公開ページをサーバー側で描画し `generateMetadata` を付ける | |

`flash`・未ログイン時のリダイレクト・404 は、段階1の最初の画面で Next 側の仕組みを作る。

0-1 で Next（3100）経由の次の動作を確認済み: Rails のリダイレクト先が Next のホストになる
（`X-Forwarded-Host`）、アセット・アップロード画像の配信、API のログインと multipart の画像アップロード、
HTML フォームの CSRF（正しい Origin は通り、別オリジンは 422）、未定義の API は JSON の 404。
0-2 では同じ確認を docker compose（Next → `http://web:3001`）と `bin/dev` で行った。

`next dev` は AI のコーディングエージェントの環境で起動されると `web/AGENTS.md` を書き出す
（`next.config` の `agentRules: false` で止まる）。コミットするかは未決。

### 🟡-A　メッセージにマッチング成立の確認が無い

`POST /message/send/:id`・`POST /api/v1/message_threads/:id/messages`・スレッド作成のいずれも
相手との関係を見ていないため、ログイン中なら任意のユーザー ID にメッセージを送れる。
「マッチング成立（`Match.accepted`）した相手とだけやり取りできる」のが仕様なら、
送信前に成立済みマッチの存在を確認する。仕様の確認が先。

実装する場合、スレッド作成は `MessageList.open_between` に集約済みなのでそこに1か所足せば
HTML・API の両方に効く（`Match.accepted.between(heir_id:, creator_id:).exists?`）。
メッセージ送信（`MessageController#send_message`・`Api::V1::MessagesController#create`）は
まだ別々なので、同じように `Message` 側へ寄せてから足す。

### 🟡-C　管理者セッションにタイムアウトとログアウトが無い

一般ユーザーは `Authentication::SESSION_TIMEOUT`（2時間）で切れるが、
`AdminAuthentication#resume_admin_session` には期限が無く、ログアウトのルートも無い。
共用端末で管理画面を開くとブラウザを閉じるまで残る。

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

### 2026-11　Next.js 移行の土台（段階 0-1・0-2）

- `web/`（Next 16.4.2）を追加し、未移行の画面と `/api/*` を `rewrites` で Rails に中継
- 開発時の入口を Next（3000）にし、Rails を 3001 へ。docker compose・`bin/dev` の両方
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
