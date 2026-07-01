import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loginModalTitle"
      onClick={close}
      onKeyDown={(e) => e.key === 'Escape' && close()}
    >
      {/* ダイアログ: クリックを親に伝播させない */}
      <div
        className="w-full max-w-md"
        role="document"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="my-modal overflow-hidden rounded-[5px] bg-white shadow-lg">
          <LoginModalHeader onClose={close} />
          <LoginModalBody />
          <LoginModalFooter />
        </div>
      </div>
    </div>,
    document.body,
  );
};
