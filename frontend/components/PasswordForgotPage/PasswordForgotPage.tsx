// frontend/components/PasswordForgotPage/PasswordForgotPage.tsx
//
// /user/password_forgot ページ（メールアドレス確認）の React コンポーネント。
// フォームは POST /user/password_forgot へ送信する。

import { getCsrfToken } from '../../utils/csrf';

export const PasswordForgotPage = () => {
  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>メールアドレス確認</h1>

      <div>
        <form action='/user/password_forgot' method='post'>
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
          <div className='input-group'>
            <label className='input-group-addon' htmlFor='password-forgot-email'>
              メールアドレス
            </label>
            <input
              type='email'
              id='password-forgot-email'
              name='user_email[email]'
              className='form-control'
              placeholder='メールアドレス'
            />
          </div>
          <div className='right_side'>
            <button type='submit' className='btn btn-primary btn-lg'>
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
