import type { FC } from 'react';

type LoginModalHeaderProps = {
  onClose: () => void;
};

export const LoginModalHeader: FC<LoginModalHeaderProps> = ({ onClose }) => (
  <div className='modal-header'>
    <h5 className='modal-title' id='loginModalTitle'>
      ログインフォーム
    </h5>
    <button type='button' className='close' onClick={onClose} aria-label='Close'>
      <span aria-hidden='true'>&times;</span>
    </button>
  </div>
);
