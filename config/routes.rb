Rails.application.routes.draw do
  get '' => 'index#root'
  get 'index' => 'index#index'
  get 'diary/show'
  get 'your_page/your_page'

  get 'user/password_forgot' => 'user#password_forgot'
  get 'user/password_reset' => 'user#password_edit'
  get 'user/create' => 'user#regist'
  get 'email/certified/:id' => 'user#email_certified_show'

  get 'my_page/my_page' => 'my_page#my_page'
  get 'my_page/update' => 'my_page#show'

  get 'creator/show' => 'creator#show'
  get 'creator/create' => 'creator#create'
  get 'creator/edit' => 'creator#edit'

  #相手ページ
  get 'page/creator/:id' => 'your_page#creator_show'
  get 'page/heir/:id/' => 'your_page#heir_show'

  #日記
  get 'diary/view' => 'diary#select_diary'
  get 'diary/post' => 'diary#regist'
  get 'diary/my_diary' => 'diary#my_diary'
  get 'diary/show/:id' => 'diary#your_diary'
  get 'diary/heir/favorite' => 'diary#heir_favorite_diary'

  #メッセージ
  get 'message/list' => 'message#view'
  get 'message/add/:id' => 'message#message_list_add'
  get 'message/history/:id' => 'message#get_history'

  #ギャラリー
  get 'gallery/view/:id' => 'gallery#user_view'
  get 'gallery/my_gallery' => 'gallery#my_gallery'
  get 'gallery/selected/:id' => 'gallery#selected_gallery'
  get 'gallery/favorite' => 'gallery#favorite_gallery'
  get 'gallery/heir/favorite' => 'gallery#heir_favorite_gallery'

  #後継者ページ
  get 'heir/show' => 'heir#heir_show'
  get 'heir/edit' => 'heir#heir_edit'

  #マッチ
  #アピール
  get 'match/appealed/list' => 'match#appealed_list_view'
  get 'match/appeal/list_check' => 'match#appeal_check'
  get 'match/matching/list' => 'match#matching_list_view'
  #スカウト
  get 'match/scouted/list' => 'match#scouted_show'
  #スカウトした一覧
  get 'match/scout/list_check' => 'match#scout_check'

  #問い合わせ
  get 'inquiry/input' => 'inquiry#input_page'

  #管理者
  get 'admin/login' => 'admin#login'
  get 'admin/create/07392' => 'admin#create'
  get 'admin/index' => 'admin_edit#index'
  get 'admin/management/user' => 'admin_edit#user'
  get 'admin/user/edit/:id' => 'admin_edit#user_edit_show'
  get 'admin/management/diary' => 'admin_edit#diary'
  get 'admin/management/diary_comment' => 'admin_edit#diary_comment'
  get 'admin/management/gallery' => 'admin_edit#gallery'
  get 'admin/management/inquiry' => 'admin_edit#inquiry'
  get 'admin/inquiry/detail/:id' => 'admin_edit#inquiry_detail_show'


  post 'index' => 'user#logout'
  post 'search/user' => 'index#search_user'

  post 'user/login' => 'user#login'
  post 'user/create' => 'user#create'
  post 'user/password_forgot' => 'user#email_exist'
  patch 'user/password_reset' => 'user#password_reset'
  post 'user/password_reset' => 'user#password_reset'

  #メールアドレス認証
  post 'email/certified/:id' => 'user#email_certified'

  patch 'my_page/update' => 'my_page#update'

  post 'creator/create' => 'creator#create'
  patch 'creator/edit' => 'creator#update'
  post 'creator/upload' => 'creator#upload'
  post 'creator/:id/delete' => 'creator#delete'

  post 'diary/post' => 'diary#post'
  post 'diary/show/:id/good' => 'diary#good'
  post 'diary/show/:id/comment' => 'diary#comment'
  post 'diary/post/:id/delete' => 'diary#post_delete'
  post 'diary/good-js' => 'diary#good'

  #お気に入り
  post 'favorite/:id/add' => 'favorite#add'
  post 'favorite/:id/delete' => 'favorite#delete'

  #ギャラリー
  post 'gallery/view' => 'gallery#upload'
  post 'gallery/my_gallery' => 'gallery#my_gallery'
  post 'gallery/user/search/tag/:id' => 'gallery#search_user_tag'
  post 'gallery/selected/comment/:id' => 'gallery#gallery_comment'
  post 'gallery/selected/good/:id' => 'gallery#gallery_good'

  #メッセージ
  post 'message/send/:id' => 'message#send_message'
  post 'message/add/:id' => 'message#message_list_add'
  post 'message/history/:id' => 'message#get_history'

  #後継者情報登録
  post 'heir/create' => 'heir#heir_create'
  patch 'heir/update' => 'heir#heir_update'

  #マッチ
  post 'match/send/:id' => 'match#appeal_send'
  post 'match/ok/:id' => 'match#appeal_answer_ok'
  post 'match/sorry/:id' => 'match#appeal_answer_sorry'
  #スカウト
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
  post 'admin/inquiry/detail/:id' => 'admin_edit#inquiry_detail'
  post 'admin/inquiry/detail/check/:id' => 'admin_edit#inquiry_detail_check'

  get '*path', controller: 'application', action: 'render_404'
end
