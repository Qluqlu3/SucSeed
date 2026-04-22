import type { FC } from 'react';
import { LoginFormField } from './LoginFormField';
import { PostForm } from './PostForm';

export const LoginModalBody: FC = () => (
  <div className="modal-body">
    <PostForm action="/user/login" className="form-group">
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
        labelClassName="input-group-addon"
        maxLength={16}
        required
      />
      <div className="modal-login-btn-box">
        <button type="submit" className="btn modal-login-btn">
          ログイン
        </button>
      </div>
    </PostForm>
  </div>
);
