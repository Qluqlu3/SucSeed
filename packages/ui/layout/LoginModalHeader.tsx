import type { FC } from 'react';

type LoginModalHeaderProps = {
  onClose: () => void;
};

export const LoginModalHeader: FC<LoginModalHeaderProps> = ({ onClose }) => (
  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
    <h5 className="text-[22px] font-bold text-p-text" id="loginModalTitle">
      ログインフォーム
    </h5>
    <button
      type="button"
      className="text-2xl leading-none text-p-muted hover:opacity-70"
      onClick={onClose}
      aria-label="Close"
    >
      &times;
    </button>
  </div>
);
