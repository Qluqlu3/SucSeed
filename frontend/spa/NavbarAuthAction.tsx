import type { FC } from 'react';
import { PostForm } from './PostForm';
import type { Role } from './session';

type NavbarAuthActionProps = {
  role: Role;
};

export const NavbarAuthAction: FC<NavbarAuthActionProps> = ({ role }) => {
  if (role === 'guest') {
    return (
      <button
        type='button'
        className='btn my-login-btn'
        data-toggle='modal'
        data-target='#exampleModalCenter'
      >
        ログイン
      </button>
    );
  }

  return (
    <PostForm action='/user/logout'>
      <button type='submit' className='btn my-login-btn'>
        ログアウト
      </button>
    </PostForm>
  );
};
