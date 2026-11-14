import type { FC } from 'react';

export const LoginModalFooter: FC = () => (
  <div className="modal-footer flex justify-end p-4">
    <a href="/user/create" className="rounded create-user-btn px-4 py-1">
      ユーザ登録はこちらから
    </a>
  </div>
);
