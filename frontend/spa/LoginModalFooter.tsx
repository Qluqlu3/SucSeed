import type { FC } from 'react';

export const LoginModalFooter: FC = () => (
  <div className='modal-footer'>
    <div>
      <a href='/user/create' className='btn create-user-btn'>
        ユーザ登録はこちらから
      </a>
    </div>
  </div>
);
