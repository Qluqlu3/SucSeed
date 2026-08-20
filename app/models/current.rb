# リクエストごとの実行コンテキスト。
#
# 従来は session[:id] / session[:creator] を各コントローラから直接読んでいたが、
# それだと「セッションの表現」と「業務ロジックが欲しい値」が密結合になり、
# 認証方式を変える際に全コントローラを触る必要があった。
# ActiveSupport::CurrentAttributes に一段挟むことで、
# コントローラ/サービス/シリアライザは Current.user だけを見ればよくなる。
#
# 値の設定は Authentication concern (#resume_session) のみが行う。
# リクエスト終端で Rails が自動リセットするため、値が次のリクエストへ漏れることはない。
class Current < ActiveSupport::CurrentAttributes
  attribute :user, :admin

  def user_id
    user&.id
  end

  def logged_in?
    user.present?
  end

  # 職人（creator）か。旧実装の session[:creator].present? と等価。
  # ログイン時点のフラグをセッションに焼き付けるのではなく毎回 users.is_creator を見るため、
  # 権限がリクエスト中に変わってもセッションを張り直す必要がない。
  def creator?
    user&.is_creator? || false
  end

  # 後継者（heir）か。creator でない、かつ heirs レコードを持つユーザー。
  def heir?
    return false if user.nil? || user.is_creator?

    user.heir.present?
  end

  def admin?
    admin.present?
  end

  # フロントの Role 型（frontend/spa/sessionTypes.ts）と 1:1 で対応する。
  def role
    return 'guest'   if user.nil?
    return 'creator' if user.is_creator?
    return 'heir'    if user.heir.present?

    'user'
  end
end
