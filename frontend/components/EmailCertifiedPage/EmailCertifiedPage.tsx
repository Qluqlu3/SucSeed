// frontend/components/EmailCertifiedPage/EmailCertifiedPage.tsx
//
// /user/email_certified ページの React コンポーネント。
// ユーザー名と session[:id] を props で受け取り、メールアドレス認証ボタンを表示する。
// フォームは POST /email/certified/:user_id へ送信する。

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

interface Props {
  user_name: string;
  user_id: number;
}

export const EmailCertifiedPage = ({ user_name, user_id }: Props) => {
  return (
    <>
      <p className="certified_text">
        {user_name}さんメールアドレスの認証をお願いいたします。
      </p>
      <div className="certified-box text-center">
        <form action={`/email/certified/${user_id}`} method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <button type="submit" className="btn btn-success certified-btn">
            メールアドレス認証
          </button>
        </form>
      </div>
    </>
  );
};
