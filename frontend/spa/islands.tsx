// frontend/spa/islands.tsx
//
// ERB layout 内の特定 DOM 要素に React コンポーネントを island として
// マウントする。application.ts からインポートされる。
// 新しい island は document.getElementById('xxx') → createRoot().render() の
// パターンで追加していく。

import { createRoot } from 'react-dom/client';
import { Footer } from './Footer';
import { LoginModal } from './LoginModal';
import { Navbar } from './Navbar';

const footerEl = document.getElementById('spa-footer');
if (footerEl) {
  createRoot(footerEl).render(<Footer />);
}

const loginModalEl = document.getElementById('spa-login-modal');
if (loginModalEl) {
  createRoot(loginModalEl).render(<LoginModal />);
}

const navbarEl = document.getElementById('spa-navbar');
if (navbarEl) {
  const role = (navbarEl.dataset.role ?? 'guest') as 'creator' | 'heir' | 'user' | 'guest';
  const artCategories = JSON.parse(navbarEl.dataset.artCategories ?? '[]') as {
    id: number;
    name: string;
  }[];
  const logoSrc = navbarEl.dataset.logoSrc ?? '';
  const titleSrc = navbarEl.dataset.titleSrc ?? '';
  createRoot(navbarEl).render(
    <Navbar role={role} artCategories={artCategories} logoSrc={logoSrc} titleSrc={titleSrc} />,
  );
}
