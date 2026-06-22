import { getCsrfToken } from '../../utils/csrf';

import { FlashMessages } from '../FlashMessages';

interface Props {
  token: string;
  errors: string[];
  flash: Record<string, string>;
}

export const PasswordResetPage = ({ token, errors, flash }: Props) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">パスワード変更</h1>

      <FlashMessages flash={flash} />

      {errors.length > 0 && (
        <div
          id="error_explanation"
          className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700"
        >
          <ul>
            {errors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <form action={`/user/password_reset/${token}`} method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <div className="mb-3">
            <span className="mb-1 block text-sm text-p-text">パスワード</span>
            <input
              type="password"
              name="user[password]"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
              maxLength={16}
              placeholder="パスワード"
            />
          </div>
          <div className="mb-3">
            <span className="mb-1 block text-sm text-p-text">パスワード確認</span>
            <input
              type="password"
              name="user[password_confirmation]"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
              maxLength={16}
              placeholder="パスワード確認"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-lg text-white hover:opacity-80"
            >
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
