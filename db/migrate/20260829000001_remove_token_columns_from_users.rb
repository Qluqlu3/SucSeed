# パスワードリセット / メールアドレス認証のトークンを DB カラムから
# Rails の署名付きトークン(generates_token_for)へ移行したため、
# 不要になったカラムを削除する。
#
# 移行後は以下のように扱われる。
#   - トークンは有効期限を内包した署名付き文字列で、DB には保存されない
#   - パスワードリセットは password_salt を含むためパスワード変更で自動失効
#   - メールアドレス認証は email を含むためアドレス変更で自動失効
#
# 【注意】このマイグレーション適用時点で未使用のリセットリンク/認証リンクは
# すべて無効になる。いずれも有効期限が1時間/24時間の短命なリンクであり、
# 利用者は再送すれば復旧できる。
class RemoveTokenColumnsFromUsers < ActiveRecord::Migration[8.1]
  def change
    remove_index :users, :email_verification_token, unique: true
    remove_index :users, :password_reset_token, unique: true

    remove_column :users, :email_verification_token, :string
    remove_column :users, :email_verification_sent_at, :datetime
    remove_column :users, :password_reset_token, :string
    remove_column :users, :password_reset_sent_at, :datetime
  end
end
