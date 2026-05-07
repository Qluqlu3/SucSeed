// frontend/components/EmailCertifiedPage/EmailCertifiedPage.tsx
//
// /user/email_certified ページの React コンポーネント。
// ユーザー名と session[:id] を props で受け取り、メールアドレス認証ボタンを表示する。
// フォームは POST /email/certified/:user_id へ送信する。

import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface Props {
  userName: string;
  userId: number;
  flash: Record<string, string>;
}

export const EmailCertifiedPage = ({ userName, userId, flash }: Props) => {
  return (
    <>
      <FlashMessages flash={flash} />
      <p className='certified_text'>{userName}さんメールアドレスの認証をお願いいたします。</p>
      <div className='certified-box text-center'>
        <form action={`/email/certified/${userId}`} method='post'>
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
          <button type='submit' className='btn btn-success certified-btn'>
            メールアドレス認証
          </button>
        </form>
      </div>
    </>
  );
};
