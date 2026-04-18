import type { FC } from 'react';

const csrfToken = (): string =>
  document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

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
          <form action='/user/login' method='post' className='form-group'>
            <input type='hidden' name='authenticity_token' value={csrfToken()} />
            <div>
              <label htmlFor='login-email'>メールアドレス</label>
              <input
                id='login-email'
                type='email'
                name='session[email]'
                className='form-control'
                placeholder='メールアドレス'
                required
              />
            </div>
            <small className='modal-small'>半角英数</small>
            <div className='modal-password-box'>
              <label htmlFor='login-password' className='input-group-addon'>
                パスワード
              </label>
              <input
                id='login-password'
                type='password'
                name='session[password]'
                className='form-control'
                maxLength={16}
                placeholder='パスワード'
                required
              />
            </div>
            <small className='modal-small'>半角英数、８文字以上１６文字以内</small>
            <div className='modal-login-btn-box'>
              <button type='submit' className='btn modal-login-btn'>
                ログイン
              </button>
            </div>
          </form>
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
