class MessageList < ApplicationRecord
  # message_lists も向きが固定されている（creator_user_id = 職人 / heir_user_id = 後継者）
  validates :creator_user_id, uniqueness: { scope: :heir_user_id }
  belongs_to :creator_user, class_name: 'User'
  belongs_to :heir_user, class_name: 'User'

  # user と partner_id の相手とのやり取りを始める（メッセージ相手のリストに追加する）。
  # 新しく追加したら true、既に追加済み（など保存できなかった）なら false を返す。
  # 追加したら、2人のマッチにも「メッセージ相手に追加済み」を立てる。
  def self.open_between(user, partner_id)
    creator_id, heir_id = user.is_creator? ? [user.id, partner_id] : [partner_id, user.id]

    transaction do
      next false unless new(creator_user_id: creator_id, heir_user_id: heir_id).save

      Match.between(heir_id: heir_id, creator_id: creator_id).update_all(is_add_list: true)
      true
    end
  end
end
