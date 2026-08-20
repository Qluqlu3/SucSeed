Rails.application.routes.draw do
  get '' => 'index#root'
  get 'index' => 'index#index'
  get 'search/user' => 'index#search_user'
  get 'map' => 'map#index'

  get 'user/password_forgot' => 'user#password_forgot'
  get 'user/password_reset/:token', to: 'user#password_edit', as: :password_reset
  get 'user/create' => 'user#regist'
  get 'email/certified/:token', to: 'user#email_certified_show', as: :email_certified

  get 'my_page/my_page' => 'my_page#my_page'
  get 'my_page/update' => 'my_page#show'

  get 'creator/show' => 'creator#show'
  get 'creator/create' => 'creator#create'
  get 'creator/edit' => 'creator#edit'

  # 相手ページ
  get 'page/creator/:id' => 'your_page#creator_show'
  get 'page/heir/:id' => 'your_page#heir_show'

  # 日記
  get 'diary/view' => 'diary#select_diary'
  get 'diary/post' => 'diary#regist'
  get 'diary/my_diary' => 'diary#my_diary'
  get 'diary/show/:id' => 'diary#your_diary'
  get 'diary/heir/favorite' => 'diary#heir_favorite_diary'

  # メッセージ
  get 'message/list' => 'message#view'

  # ギャラリー
  get 'gallery/view/:id' => 'gallery#user_view'
  get 'gallery/my_gallery' => 'gallery#my_gallery'
  get 'gallery/selected/:id' => 'gallery#selected_gallery'
  get 'gallery/favorite' => 'gallery#favorite_gallery'
  get 'gallery/heir/favorite' => 'gallery#heir_favorite_gallery'

  # 後継者ページ
  get 'heir/show' => 'heir#heir_show'
  get 'heir/edit' => 'heir#heir_edit'

  # マッチ
  # アピール
  get 'match/appealed/list' => 'match#appealed_list_view'
  get 'match/appeal/list_check' => 'match#appeal_check'
  get 'match/matching/list' => 'match#matching_list_view'
  # スカウト
  get 'match/scouted/list' => 'match#scouted_show'
  # スカウトした一覧
  get 'match/scout/list_check' => 'match#scout_check'

  # 問い合わせ
  get 'inquiry/input' => 'inquiry#input_page'

  # 管理者
  get 'admin/login' => 'admin#login'
  # HTTP Basic 認証で保護済み（admin_controller#require_basic_auth）
  get 'admin/create' => 'admin#create'
  get 'admin/index' => 'admin_edit#index'
  get 'admin/management/user' => 'admin_edit#user'
  get 'admin/user/edit/:id' => 'admin_edit#user_edit_show'
  get 'admin/management/diary' => 'admin_edit#diary'
  get 'admin/management/diary_comment' => 'admin_edit#diary_comment'
  get 'admin/management/gallery' => 'admin_edit#gallery'
  get 'admin/management/inquiry' => 'admin_edit#inquiry'
  get 'admin/inquiry/detail/:id' => 'admin_edit#inquiry_detail_show'

  post 'user/logout' => 'user#logout'

  post 'user/login' => 'user#login'
  post 'user/create' => 'user#create'
  post 'user/password_forgot' => 'user#email_exist'
  patch 'user/password_reset/:token', to: 'user#password_reset'
  post  'user/password_reset/:token', to: 'user#password_reset'

  # メールアドレス認証
  post 'email/certified/:token', to: 'user#email_certified'

  patch 'my_page/update' => 'my_page#update'

  post 'creator/create' => 'creator#create'
  patch 'creator/edit' => 'creator#update'

  post 'diary/post' => 'diary#post'
  post 'diary/show/:id/good' => 'diary#good'
  post 'diary/show/:id/comment' => 'diary#comment'
  post 'diary/post/:id/delete' => 'diary#post_delete'

  # お気に入り
  post 'favorite/:id/add' => 'favorite#add'
  post 'favorite/:id/delete' => 'favorite#delete'

  # ギャラリー
  post 'gallery/view' => 'gallery#upload'
  post 'gallery/my_gallery' => 'gallery#my_gallery'
  post 'gallery/user/search/tag/:id' => 'gallery#search_user_tag'
  post 'gallery/selected/comment/:id' => 'gallery#gallery_comment'
  post 'gallery/selected/good/:id' => 'gallery#gallery_good'

  # メッセージ
  post 'message/send/:id' => 'message#send_message'
  post 'message/add/:id' => 'message#message_list_add'
  post 'message/history/:id' => 'message#get_history'

  # 後継者情報登録
  post 'heir/create' => 'heir#heir_create'
  patch 'heir/update' => 'heir#heir_update'

  # マッチ
  post 'match/send/:id' => 'match#appeal_send'
  post 'match/ok/:id' => 'match#appeal_answer_ok'
  post 'match/sorry/:id' => 'match#appeal_answer_sorry'
  # スカウト
  post 'scout/send/:id' => 'match#scout_send'
  post 'scout/ok/:id' => 'match#scout_answer_ok'
  post 'scout/sorry/:id' => 'match#scout_answer_sorry'

  post 'inquiry/input' => 'inquiry#send_inquiry'

  post 'admin/login' => 'admin#login_challenge'
  post 'admin/create/user' => 'admin#create_user'

  post 'admin/user/delete/:id' => 'admin_edit#user_delete'
  patch 'admin/user/edit/:id' => 'admin_edit#user_edit'
  post 'admin/diary/delete/:id' => 'admin_edit#diary_delete'
  post 'admin/diary_comment/delete/:id' => 'admin_edit#diary_comment_delete'
  post 'admin/gallery/delete/:id' => 'admin_edit#gallery_delete'
  post 'admin/inquiry/detail/check/:id' => 'admin_edit#inquiry_detail_check'

  # ── JSON API (v1) ─────────────────────────────────────────────────────────
  # 上の HTML ルーティングは「ページ全体を返す」ためのもので、こちらは React から
  # fetch される純粋な JSON エンドポイント。同一オリジンのセッション Cookie で認証する。
  namespace :api do
    namespace :v1 do
      # 認証・セッション
      # controller を明示するのは、単数形 resource の既定が sessions#... になるため
      resource :session, only: %i[show create destroy], controller: 'session'

      # マスタデータ
      resources :art_categories, only: :index
      resources :traditional_crafts, only: :index

      # ユーザー / プロフィール
      resource  :profile, only: %i[show update], controller: 'profile'
      resources :creators, only: %i[index show]
      resources :heirs, only: :show

      # お気に入り（:id は相手ユーザーの id）
      resources :favorites, only: %i[index create destroy]

      # 日記
      resources :diaries, only: %i[index create destroy] do
        resource  :good, only: %i[create destroy], controller: 'diary_goods'
        resources :comments, only: :create, controller: 'diary_comments'
      end

      # ギャラリー
      resources :galleries, only: %i[index show] do
        resource  :good, only: %i[create destroy], controller: 'gallery_goods'
        resources :comments, only: :create, controller: 'gallery_comments'
      end

      # マッチング
      # appeals: 後継者 → 職人 への応募 / scouts: 職人 → 後継者 への勧誘
      # いずれも :id は「相手ユーザーの id」を指す
      resources :appeals, only: %i[index create update]
      resources :scouts, only: %i[index create update]
      resources :matches, only: :index

      # メッセージ（:id はスレッド相手のユーザー id）
      resources :message_threads, only: %i[index show create] do
        resources :messages, only: :create
      end
    end
  end

  # API 配下の未定義パスは HTML の 404 ページではなく JSON で返す
  match 'api/*path', to: 'api/v1/not_found#show', via: :all

  get '*path', controller: 'application', action: 'render_404'
end
