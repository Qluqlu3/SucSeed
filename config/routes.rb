Rails.application.routes.draw do
  get '' => 'index#root'
  get 'index' => 'index#index'
  get 'diary/show'
  get 'your_page/your_page'

  get 'user/login' => 'user#login'
  get 'user/password_forgot' => 'user#password_forgot'
  get 'user/password_reset' => 'user#password_edit'
  get 'user/create' => 'user#regist'

  get 'my_page/my_page' => 'my_page#my_page'
  get 'my_page/update' => 'my_page#show'

  get 'creator/show' => 'creator#show'
  get 'creator/create' => 'creator#create'
  get 'creator/upload' => 'creator#data'
  get 'creator/update' => 'creator#edit'

  #相手ページ
  get 'page/creator/:id' => 'your_page#creator_show'
  get 'page/heir/:id/' => 'your_page#heir_show'

  #日記
  get 'diary/view' => 'diary#select_diary'
  get 'diary/post' => 'diary#regist'
  get 'diary/my_diary' => 'diary#my_diary'
  get 'diary/show/:id' => 'diary#your_diary'

  #メッセージ
  get 'message/list' => 'message#view'
  get 'message/add/:id' => 'message#message_list_add'

  #ギャラリー
  get 'gallery/view/:id' => 'gallery#user_view'
  get 'gallery/my_gallery' => 'gallery#my_gallery'
  get 'gallery/selected/:id' => 'gallery#selected_gallery'

  #認証
  get 'certify/set' => 'certify#set'

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


  post 'index' => 'user#logout'

  post 'user/login' => 'user#signin'
  post 'user/create' => 'user#create'
  post 'user/password_forgot' => 'user#email_exist'
  patch 'user/password_reset' => 'user#password_reset'
  post 'user/password_reset' => 'user#password_reset'

  patch 'my_page/update' => 'my_page#update'

  post 'creator/create' => 'creator#create'
  patch 'creator/update' => 'creator#update'
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

  #メッセージ
  post 'message/send/:id' => 'message#send_message'
  post 'message/add/:id' => 'message#message_list_add'
  post 'message/history/:id' => 'message#get_history'

  #後継者情報登録
  post 'heir/create' => 'heir#heir_create'
  patch 'heir/update' => 'heir#heir_update'

  #マッチ
  post 'match/:id/send' => 'match#appeal_send'
  post 'match/:id/ok' => 'match#appeal_answer_ok'
  post 'match/:id/sorry' => 'match#appeal_answer_sorry'
  #スカウト
  post 'scout/send/:id' => 'match#scout_send'
  post 'scout/ok/:id' => 'match#scout_answer_ok'
  post 'scout/sorry/:id' => 'match#scout_answer_sorry'

  get '*path', controller: 'application', action: 'render_404'
end