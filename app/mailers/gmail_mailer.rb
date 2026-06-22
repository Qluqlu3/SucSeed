class GmailMailer < ApplicationMailer
  def send_create(user)
    @user = user
    mail to: user.email,
         subject: '登録完了'
  end

  def send_certification(user)
    @user = user
    @certification_url = email_certified_url(user.email_verification_token)
    mail to: user.email,
         subject: 'メールアドレス認証'
  end

  def send_password_reset(user)
    @user = user
    @reset_url = password_reset_url(user.password_reset_token)
    mail to: user.email,
         subject: 'パスワードリセット'
  end
end
