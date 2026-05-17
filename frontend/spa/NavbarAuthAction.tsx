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
        className='btn my-login-btn'
        onClick={() => window.dispatchEvent(new CustomEvent('sucseed:login-modal-open'))}
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
