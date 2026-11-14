# ユーザー単体のページ（日記・作品ギャラリーなど、:id で相手を指す画面）の見出しに使う表現。
# 公開してよい項目（PublicUserSerializer）に、職人ページへのタブを出すかの判定を足す。
class PublicUserPageSerializer < PublicUserSerializer
  # 職人の詳細プロフィール（creators）を登録済みか。/page/creator/:id はこれが無いと開けない
  attribute(:has_creator_profile) { |user| user.creator.present? }
end
