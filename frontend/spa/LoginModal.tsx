import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { FC } from 'react';
import { LoginModalBody } from './LoginModalBody';
import { LoginModalFooter } from './LoginModalFooter';
import { LoginModalHeader } from './LoginModalHeader';

export const LoginModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Navbar のログインボタンからカスタムイベントで開く
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('sucseed:login-modal-open', handler);
    return () => window.removeEventListener('sucseed:login-modal-open', handler);
  }, []);

  // モーダル開放中は body のスクロールを禁止（Bootstrap の modal-open と同じ挙動）
  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* オーバーレイ: クリックで閉じる */}
      <div
        className='modal show'
        style={{ display: 'block' }}
        role='dialog'
        aria-modal='true'
        aria-labelledby='loginModalTitle'
        onClick={close}
      >
        {/* ダイアログ: クリックを親に伝播させない */}
        <div
          className='modal-dialog modal-dialog-centered'
          role='document'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='modal-content my-modal'>
            <LoginModalHeader onClose={close} />
            <LoginModalBody />
            <LoginModalFooter />
          </div>
        </div>
      </div>
      {/* バックドロップ */}
      <div className='modal-backdrop show' />
    </>,
    document.body,
  );
};
