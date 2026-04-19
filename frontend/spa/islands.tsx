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

type Role = 'creator' | 'heir' | 'user' | 'guest';

const isRole = (value: unknown): value is Role =>
  value === 'creator' || value === 'heir' || value === 'user' || value === 'guest';

const fetchSessionRole = async (): Promise<Role> => {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return 'guest';
    }
    const json = (await response.json()) as { role?: unknown };
    return isRole(json.role) ? json.role : 'guest';
  } catch {
    return 'guest';
  }
};

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
  const artCategories = JSON.parse(navbarEl.dataset.artCategories ?? '[]') as {
    id: number;
    name: string;
  }[];
  const logoSrc = navbarEl.dataset.logoSrc ?? '';
  const titleSrc = navbarEl.dataset.titleSrc ?? '';

  const mountNavbar = async () => {
    const role = await fetchSessionRole();
    createRoot(navbarEl).render(
      <Navbar role={role} artCategories={artCategories} logoSrc={logoSrc} titleSrc={titleSrc} />,
    );

    // ログイン中のみ none-margin-box を表示（ERB 条件分岐の代替）
    const marginBoxEl = document.getElementById('spa-margin-box');
    if (marginBoxEl) {
      marginBoxEl.className = role !== 'guest' ? 'none-margin-box' : '';
    }
  };

  void mountNavbar();
}
