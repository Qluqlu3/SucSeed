// frontend/components/EmailCertifiedPage/EmailCertifiedPage.tsx
//
// /user/email_certified ページの React コンポーネント。
// ユーザー名と session[:id] を props で受け取り、メールアドレス認証ボタンを表示する。
// フォームは POST /email/certified/:user_id へ送信する。

import { getCsrfToken } from '../../utils/csrf';

interface Props {
  userName: string;
  userId: number;
}

export const EmailCertifiedPage = ({ userName, userId }: Props) => {
  return (
    <>
      <p className="certified_text">{userName}さんメールアドレスの認証をお願いいたします。</p>
      <div className="certified-box text-center">
        <form action={`/email/certified/${userId}`} method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <button type="submit" className="btn btn-success certified-btn">
            メールアドレス認証
          </button>
        </form>
      </div>
    </>
  );
};
