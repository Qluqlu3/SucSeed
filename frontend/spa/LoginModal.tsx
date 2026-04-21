import type { FC } from 'react';
import { LoginFormField } from './LoginFormField';
import { PostForm } from './PostForm';

export const LoginModal: FC = () => (
  <div
    className='modal fade'
    id='exampleModalCenter'
    tabIndex={-1}
    role='dialog'
    aria-labelledby='exampleModalCenterTitle'
    aria-hidden='true'
    style={{ zIndex: 1500 }}
  >
    <div className='modal-dialog modal-dialog-centered' role='document'>
      <div className='modal-content my-modal'>
        <div className='modal-header'>
          <h5 className='modal-title' id='exampleModalLongTitle'>
            ログインフォーム
          </h5>
          <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
        <div className='modal-body'>
          <PostForm action='/user/login' className='form-group'>
            <LoginFormField
              id='login-email'
              type='email'
              name='session[email]'
              label='メールアドレス'
              placeholder='メールアドレス'
              helperText='半角英数'
              required
            />
            <LoginFormField
              id='login-password'
              type='password'
              name='session[password]'
              label='パスワード'
              placeholder='パスワード'
              helperText='半角英数、８文字以上１６文字以内'
              containerClassName='modal-password-box'
              labelClassName='input-group-addon'
              maxLength={16}
              required
            />
            <div className='modal-login-btn-box'>
              <button type='submit' className='btn modal-login-btn'>
                ログイン
              </button>
            </div>
          </PostForm>
        </div>
        <div className='modal-footer'>
          <div>
            <a href='/user/create' className='btn create-user-btn'>
              ユーザ登録はこちらから
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
