# メッセージ1件の表現。
class MessageSerializer < ApplicationSerializer
  attributes :id, :content, :created_at, :send_user_id, :receive_user_id

  # 自分が送ったものか。吹き出しを左右どちらに出すかの判定に使う。
  attribute(:mine) { |message| message.send_user_id == params[:viewer_id] }
end
