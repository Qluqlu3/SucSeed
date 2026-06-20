class GmailMailer < ApplicationMailer
  def send_create(user)
    @user = user
    mail to: user.email,
         subject: '登録完了'
  end

  def send_certification(user)
    @user = user
    mail to: user.email,
         subject: 'メールアドレス認証'
  end
end
