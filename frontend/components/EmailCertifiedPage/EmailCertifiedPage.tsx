import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface Props {
  userName: string;
  token: string;
  flash: Record<string, string>;
}

export const EmailCertifiedPage = ({ userName, token, flash }: Props) => {
  return (
    <>
      <FlashMessages flash={flash} />
      <p className="mt-[10%] ml-[31%] text-p-text text-[23px]">
        {userName}さんメールアドレスの認証をお願いいたします。
      </p>
      <div className="h-[68vh] text-center">
        <form action={`/email/certified/${token}`} method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <button
            type="submit"
            className="mt-[3%] h-15 rounded bg-green-600 px-6 text-[26px] text-white hover:opacity-80"
          >
            メールアドレス認証
          </button>
        </form>
      </div>
    </>
  );
};
