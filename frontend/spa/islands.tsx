// frontend/spa/islands.tsx
//
// ERB layout 内の特定 DOM 要素に React コンポーネントを island として
// マウントする。application.ts からインポートされる。
// 新しい island は document.getElementById('xxx') → createRoot().render() の
// パターンで追加していく。

import { createRoot } from 'react-dom/client';
import { Footer } from './Footer';
import { LoginModal } from './LoginModal';

const footerEl = document.getElementById('spa-footer');
if (footerEl) {
  createRoot(footerEl).render(<Footer />);
}

const loginModalEl = document.getElementById('spa-login-modal');
if (loginModalEl) {
  createRoot(loginModalEl).render(<LoginModal />);
}
