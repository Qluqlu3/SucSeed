import type { FC } from 'react';

export const LoginModalHeader: FC = () => (
  <div className='modal-header'>
    <h5 className='modal-title' id='exampleModalLongTitle'>
      ログインフォーム
    </h5>
    <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
      <span aria-hidden='true'>&times;</span>
    </button>
  </div>
);
