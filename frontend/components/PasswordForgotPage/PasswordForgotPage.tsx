// frontend/components/PasswordForgotPage/PasswordForgotPage.tsx
//
// /user/password_forgot ページ（メールアドレス確認）の React コンポーネント。
// フォームは POST /user/password_forgot へ送信する。

import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

type Props = { flash: Record<string, string> };

export const PasswordForgotPage = ({ flash }: Props) => {
  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
        メールアドレス確認
      </h1>

      <FlashMessages flash={flash} />

      <div className="w-[90%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]">
        <form action="/user/password_forgot" method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <div className="mb-4">
            <label className="block mb-1 text-p-text" htmlFor="password-forgot-email">
              メールアドレス
            </label>
            <input
              type="email"
              id="password-forgot-email"
              name="user_email[email]"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
              placeholder="メールアドレス"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-white hover:opacity-80"
            >
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
