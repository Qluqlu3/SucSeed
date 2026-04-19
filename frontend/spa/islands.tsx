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
import { fetchSessionPayload } from './session';

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
  const mountNavbar = async () => {
    const { role, artCategories, layoutAssets } = await fetchSessionPayload();
    createRoot(navbarEl).render(
      <Navbar
        role={role}
        artCategories={artCategories}
        logoSrc={layoutAssets.logoSrc}
        titleSrc={layoutAssets.titleSrc}
      />,
    );

    // ログイン中のみ none-margin-box を表示（ERB 条件分岐の代替）
    const marginBoxEl = document.getElementById('spa-margin-box');
    if (marginBoxEl) {
      marginBoxEl.className = role !== 'guest' ? 'none-margin-box' : '';
    }
  };

  void mountNavbar();
}
