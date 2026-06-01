import type { FC } from 'react';
import { PostForm } from '../components/PostForm';
import type { Role } from './sessionTypes';

type NavbarAuthActionProps = {
  role: Role;
};

export const NavbarAuthAction: FC<NavbarAuthActionProps> = ({ role }) => {
  if (role === 'guest') {
    return (
      <button
        type='button'
        className='rounded bg-p-brand px-4 py-2 text-white hover:opacity-80 my-login-btn'
      >
        ログイン
      </button>
    );
  }

  return (
    <PostForm action='/user/logout'>
      <button
        type='submit'
        className='rounded bg-p-brand px-4 py-2 text-white hover:opacity-80 my-login-btn'
      >
        ログアウト
      </button>
    </PostForm>
  );
};
