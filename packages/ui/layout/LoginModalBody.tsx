import type { FC } from 'react';
import { PostForm } from '../components/PostForm';
import { LoginFormField } from './LoginFormField';

export const LoginModalBody: FC = () => (
  <div className="p-4">
    <PostForm action="/user/login" className="mb-3">
      <LoginFormField
        id="login-email"
        type="email"
        name="session[email]"
        label="メールアドレス"
        placeholder="メールアドレス"
        helperText="半角英数"
        required
      />
      <LoginFormField
        id="login-password"
        type="password"
        name="session[password]"
        label="パスワード"
        placeholder="パスワード"
        helperText="半角英数、８文字以上１６文字以内"
        containerClassName="modal-password-box"
        maxLength={16}
        required
      />
      <div className="modal-login-btn-box">
        <button type="submit" className="rounded modal-login-btn px-4 py-1">
          ログイン
        </button>
      </div>
    </PostForm>
  </div>
);
