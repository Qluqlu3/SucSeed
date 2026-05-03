// frontend/components/PasswordResetPage/PasswordResetPage.tsx
//
// /user/password_reset ページ（パスワード変更）の React コンポーネント。
// Rails の @user.errors.full_messages を errors プロップで受け取って表示する。
// フォームは POST /user/password_reset へ送信する。

import { getCsrfToken } from '../../utils/csrf';

import { FlashMessages } from '../FlashMessages';

interface Props {
  errors: string[];
  flash: Record<string, string>;
}

export const PasswordResetPage = ({ errors, flash }: Props) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">パスワード変更</h1>

      <FlashMessages flash={flash} />

      {errors.length > 0 && (
        <div id="error_explanation" className="alert alert-danger">
          <ul>
            {errors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <form action="/user/password_reset" method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <div className="input-group">
            <span className="input-group-addon">パスワード</span>
            <input
              type="password"
              name="user[password]"
              className="form-control"
              maxLength={16}
              placeholder="パスワード"
            />
          </div>
          <div className="input-group">
            <span className="input-group-addon">パスワード確認</span>
            <input
              type="password"
              name="user[password_confirmation]"
              className="form-control"
              maxLength={16}
              placeholder="パスワード確認"
            />
          </div>
          <div className="right_side">
            <button type="submit" className="btn btn-primary btn-lg">
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
