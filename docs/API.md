# SucSeed JSON API (v1)

`/api/v1` 配下の JSON API リファレンス。

同一オリジンの React island から **セッション Cookie** で認証する前提の API。
トークン発行や外部公開は想定していない。

---

## 設計方針

| 項目 | 方針 |
|---|---|
| 基底クラス | `Api::BaseController < ActionController::API`（[app/controllers/api/base_controller.rb](../app/controllers/api/base_controller.rb)） |
| 認証 | セッション Cookie。既定で **ログイン必須**、公開エンドポイントのみ `allow_unauthenticated_access` を宣言 |
| CSRF | `protect_from_forgery with: :exception`。GET 以外は `X-CSRF-Token` ヘッダが必要 |
| 認可 | `require_creator` / `require_non_creator`（[app/controllers/concerns/authentication.rb](../app/controllers/concerns/authentication.rb)） |
| レスポンス整形 | `app/serializers`（Alba）。キーは `transform_keys :lower_camel` で camelCase |
| レート制限 | IP 単位（`Rack::Attack`）とユーザー単位（`rate_limit`）の二段構え。後述 |

TypeScript 側の型定義とクライアントは [frontend/api/](../frontend/api/) にある。
**シリアライザを変更したら `frontend/api/types.ts` も更新すること。**
忘れると
[test/serializers/serializer_contract_test.rb](../test/serializers/serializer_contract_test.rb)
が落ちる（JSON は `JSON.parse` で入ってくるので TypeScript のコンパイルでは検出できない）。

---

## 共通のレスポンス形式

### 成功

- 単数リソース: オブジェクトをそのまま返す
- コレクション: `{ "items": [...], "pagination": {...} }`
- 削除: `204 No Content`

```json
{
  "items": [{ "userId": "abc...", "name": "山田" }],
  "pagination": { "currentPage": 1, "totalPages": 3, "totalCount": 30 }
}
```

### ページネーション

**データ量に応じて増える一覧はすべてページングされる。** `pagination` を持たないのは
件数が構造的に増えないマスタデータ（`art_categories` / `traditional_crafts`）だけ。

| パラメータ | 説明 |
|---|---|
| `page` | 1 始まり。範囲外を指定すると `page_out_of_range` の 404 |
| `per_page` | 1ページの件数。**サーバー側で 100 件に打ち止め**。不正値は既定値になる |

既定の件数はエンドポイントごとに異なる。

| エンドポイント | 既定 | 理由 |
|---|:---:|---|
| `/diaries` | 10 | 1件にコメントといいねを含むため |
| `/galleries` | 24 | サムネイルのグリッド表示 |
| `/creators` | 12 | カードの一覧 |
| `/favorites`, `/appeals`, `/scouts`, `/matches`, `/message_threads` | 20 | |
| `/message_threads/:id` の履歴 | 50 | |

メッセージ履歴だけは **新しい順にページを切り出し、ページ内は古い順** で返す。
チャットは直近から見たいが、表示は時系列順が自然なため。`page` を増やすと
より古いメッセージが取れる。

### 失敗

**すべてのエラーがこの形で返る。** フロントは `error.code` だけ見れば分岐できる。

```json
{
  "error": {
    "code": "unprocessable_entity",
    "message": "入力内容を確認してください",
    "details": ["コメントを入力してください"]
  }
}
```

| code | HTTP | 意味 |
|---|:---:|---|
| `unauthorized` | 401 | ログインが必要 |
| `session_expired` | 401 | セッションが 2 時間の無操作でタイムアウト |
| `invalid_credentials` | 401 | ログイン失敗（メール未登録とパスワード誤りを区別しない） |
| `forbidden` | 403 | 職人/後継者の権限が足りない |
| `not_found` | 404 | リソースが存在しない、または自分のものではない |
| `page_out_of_range` | 404 | 範囲外のページ指定 |
| `bad_request` | 400 | 必須パラメータ不足 |
| `unprocessable_entity` | 422 | バリデーションエラー（`details` に理由） |
| `invalid_authenticity_token` | 422 | CSRF トークン不一致 |
| `too_many_requests` | 429 | レート制限 |

---

## エンドポイント一覧

凡例: 🔓 = 未ログインでも可 / 🎨 = 職人のみ / 🌱 = 後継者のみ

### セッション

| | パス | 説明 |
|---|---|---|
| 🔓 GET | `/api/v1/session` | ログイン状態・ロール・CSRF トークン・レイアウト用アセットを返す |
| 🔓 POST | `/api/v1/session` | ログイン。body: `{ session: { email, password } }` |
| 🔓 DELETE | `/api/v1/session` | ログアウト（未ログインでもエラーにしない） |

`role` は `creator` / `heir` / `user` / `guest` のいずれか。

### マスタデータ

| | パス | 説明 |
|---|---|---|
| 🔓 GET | `/api/v1/art_categories` | 工芸分野の一覧 |
| 🔓 GET | `/api/v1/traditional_crafts` | 伝統工芸品の一覧（同分野・同都道府県の職人数付き） |

### プロフィール

| | パス | 説明 |
|---|---|---|
| GET | `/api/v1/profile` | 自分のプロフィール |
| PATCH | `/api/v1/profile` | 更新。body: `{ user: { name, email, profile } }` |

アバター画像も同じ `PATCH /api/v1/profile` で更新できるが、multipart/form-data で
`user[avatar_path]` を送る必要がある（後述の「画像のアップロードについて」を参照）。

### 職人 / 後継者

| | パス | 説明 |
|---|---|---|
| 🔓 GET | `/api/v1/creators` | 募集中の職人一覧（12件/ページ）。`?page=` `?art_category_id=` |
| 🔓 GET | `/api/v1/creators/:id` | 職人詳細（`:id` は職人の user_id） |
| 🔓 GET | `/api/v1/heirs/:id` | 後継者詳細（`:id` は後継者の user_id） |

職人としてログイン中は一覧から自分自身が除外される。
詳細には閲覧者から見た `isFavorited` / `isAppealed` / `isScouted` / `isOwn` が含まれる。

### お気に入り

| | パス | 説明 |
|---|---|---|
| GET | `/api/v1/favorites` | 自分がお気に入り登録した相手の一覧 |
| POST | `/api/v1/favorites` | 登録。body: `{ id: <相手の user_id> }` |
| DELETE | `/api/v1/favorites/:id` | 解除（未登録でもエラーにしない） |

### 日記

| | パス | 説明 |
|---|---|---|
| 🔓 GET | `/api/v1/diaries?user_id=xxx` | 指定ユーザーの日記 |
| GET | `/api/v1/diaries` | 自分 + お気に入り登録した相手のフィード |
| 🎨 POST | `/api/v1/diaries` | 投稿。body: `{ diary: { content } }` |
| DELETE | `/api/v1/diaries/:id` | 自分の投稿を論理削除 |
| POST | `/api/v1/diaries/:diary_id/good` | いいね |
| DELETE | `/api/v1/diaries/:diary_id/good` | いいね取り消し |
| POST | `/api/v1/diaries/:diary_id/comments` | コメント。body: `{ diary_comment: { comment } }` |

いいねの POST / DELETE は現在の状態 `{ diaryId, goodCount, myGood }` を返すので、
フロントはクライアント側でカウントを増減させず、返ってきた値をそのまま表示する。

### ギャラリー

| | パス | 説明 |
|---|---|---|
| 🔓 GET | `/api/v1/galleries?user_id=xxx` | 指定ユーザーの作品。`&tag=漆器` でタグ絞り込み |
| GET | `/api/v1/galleries` | 自分 + お気に入り登録した相手のフィード |
| 🔓 GET | `/api/v1/galleries/:id` | 作品詳細（コメント・関連作品・職人情報を含む） |
| 🎨 POST | `/api/v1/galleries` | 作品投稿（**multipart/form-data**）|
| POST | `/api/v1/galleries/:gallery_id/good` | いいね |
| DELETE | `/api/v1/galleries/:gallery_id/good` | いいね取り消し |
| POST | `/api/v1/galleries/:gallery_id/comments` | コメント |

### 画像のアップロードについて

作品投稿（`POST /api/v1/galleries`）とアバター更新（`PATCH /api/v1/profile`）は
CarrierWave が `UploadedFile` しか受け取れないため **multipart/form-data** で送る。
JSON でファイル名の文字列を渡した場合は `not_multipart` の 400 を返す
（そのまま CarrierWave に渡すと `CarrierWave::FormNotMultipart` で 500 になるため）。

TypeScript クライアントは `api.galleries.create({ data, comment, tagList })` と
`api.profile.updateAvatar(file)` が `FormData` を組み立てる。`Content-Type` は
boundary 付きでブラウザに設定させる必要があるため指定していない。

### マッチング

`matches` テーブルは向きが固定されており、`user_id` が常に後継者、`target_user_id` が常に職人。
`is_scout` がどちらから声を掛けたかを表す。API はこれを `heirUserId` / `creatorUserId` という
意味のある名前で公開する。

| | パス | 説明 |
|---|---|---|
| GET | `/api/v1/appeals` | 職人: 自分宛の未回答応募 / 後継者: 自分が送った応募 |
| 🌱 POST | `/api/v1/appeals` | 応募する。body: `{ creator_id }` |
| 🎨 PATCH | `/api/v1/appeals/:id` | 回答する（`:id` は応募者の user_id）。body: `{ accepted: true }` |
| GET | `/api/v1/scouts` | 職人: 自分が送ったスカウト / 後継者: 自分宛の未回答スカウト |
| 🎨 POST | `/api/v1/scouts` | スカウトする。body: `{ heir_id }` |
| 🌱 PATCH | `/api/v1/scouts/:id` | 回答する（`:id` はスカウト元の user_id）。body: `{ accepted: true }` |
| GET | `/api/v1/matches` | 成立済み（`isOk = true`）のマッチング一覧 |

### メッセージ

| | パス | 説明 |
|---|---|---|
| GET | `/api/v1/message_threads` | やり取り相手の一覧 |
| GET | `/api/v1/message_threads/:id` | `:id` の相手との履歴（直近50件、ページ内は古い順） |
| POST | `/api/v1/message_threads` | 相手をリストに追加。body: `{ user_id }` |
| POST | `/api/v1/message_threads/:message_thread_id/messages` | 送信。body: `{ message: { content } }` |

履歴は「自分が送信者または受信者であるメッセージ」だけを返すため、
他人同士のやり取りは `:id` を差し替えても取得できない。

---

## フロントエンドからの呼び出し

```ts
import { api } from '../../api';

const result = await api.favorites.create(userId);

if (result.ok) {
  setIsFavorited(result.data.favorited);
} else {
  setErrorMessage(result.error.message);
}
```

`ApiResult<T>` は `{ ok: true; data: T } | { ok: false; error: ApiError }` の判別可能ユニオン。
`result.ok` を確認しないと `data` に触れられないため、
「レスポンスを見ずに楽観的に state を更新する」実装が型レベルで防がれる。

---

## レート制限

**IP 単位とユーザー単位の二段構え**で、どちらか一方でも超えたら `429` /
`too_many_requests` を返す。

| 軸 | 実装 | 何を防ぐか |
|---|---|---|
| IP 単位 | `Rack::Attack`（[config/initializers/rack_attack.rb](../config/initializers/rack_attack.rb)）| 特定のホストからの大量アクセス。HTML 版と同じカウンタを共有する |
| ユーザー単位 | Rails 8 の `rate_limit`（[app/controllers/concerns/api_rate_limiting.rb](../app/controllers/concerns/api_rate_limiting.rb)）| IP を変えながらの投稿スパム |

IP 単位だけだと「同じ NAT の裏にいる無関係な利用者と枠を共有する（誤検知）」と
「IP を変えれば1人でいくらでも投稿できる（検知漏れ）」の両方が起きるため、
軸を分けて重ねている。

### ユーザー単位の上限

| エンドポイント | 上限 |
|---|---|
| `POST /diaries`, `POST /galleries` | 10回 / 10分 |
| `POST /diaries/:id/comments`, `POST /galleries/:id/comments` | 20回 / 5分 |
| `POST /message_threads/:id/messages` | 30回 / 5分 |
| `POST /appeals`, `POST /scouts` | 30回 / 10分 |
| `POST /session` | 10回 / 10分（**メールアドレス単位**）|

ログインだけは IP でもユーザーIDでもなく **メールアドレス単位**で数える。
IP 単位の制限は「多数の IP から1つのアカウントを狙う」分散総当たりを
素通りさせてしまうため、狙われている側を基準に数える必要がある。
`normalizes` と揃えて小文字化してから数えるので、大文字小文字を変えても回避できない。

> **運用上の注意**: `rate_limit` のカウンタは `Rails.cache` に載る。
> `cache_store` がプロセスローカルな実装（`:memory_store` / `:file_store`）だと
> 複数プロセス・複数インスタンスで別カウントになり、実効上限が台数倍になる。

---

## 既知の制約

- **ログインフォームだけは HTML フォーム送信のまま**。ログイン後はページ全体を
  描き直す必要があり、API 化しても結局リロードするため。
- HTML 版の投稿系エンドポイント（`POST /diary/show/:id/good`、`POST /gallery/view` など）は
  ルーティングとして残っているが、フロントからは呼んでいない。

---

## 品質チェック

| 対象 | コマンド | 内容 |
|---|---|---|
| テスト | `bin/rails test` | API のリクエストテスト（正常系・認可・バリデーション・エラー形式・ページネーション・レート制限）|
| N+1 | 同上 | Bullet が `raise = true` で検出。N+1 があるとテストが落ちる |
| 型のドリフト | 同上 | シリアライザのキー集合を固定。変えると `frontend/api/types.ts` の更新を促して落ちる |
| 静的解析 | `bundle exec rubocop` | `Rails/StrongParametersExpect` で `params.expect` を強制 |
| セキュリティ | `bundle exec brakeman` / `bundle exec bundler-audit check` | |
| 型 | `pnpm exec tsc --noEmit` | `frontend/api/types.ts` とコンポーネントの整合 |
