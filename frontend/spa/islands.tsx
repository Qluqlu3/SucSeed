// frontend/spa/islands.tsx
//
// ERB layout 内の特定 DOM 要素に React コンポーネントを island として
// マウントする。application.ts からインポートされる。
// 新しい island は mountIsland('xxx', <Component />) の
// パターンで追加していく。

import { Footer } from './Footer';
import { LoginModal } from './LoginModal';
import { mountIsland } from './mountIsland';
import { Navbar } from './Navbar';
import { fetchSessionPayload } from './session';
import { updateMarginBox } from './updateMarginBox';

mountIsland('spa-footer', <Footer />);
mountIsland('spa-login-modal', <LoginModal />);

const navbarEl = document.getElementById('spa-navbar');
if (navbarEl) {
  const mountNavbar = async () => {
    const { role, artCategories, layoutAssets } = await fetchSessionPayload();
    mountIsland(
      'spa-navbar',
      <Navbar
        role={role}
        artCategories={artCategories}
        logoSrc={layoutAssets.logoSrc}
        titleSrc={layoutAssets.titleSrc}
      />,
    );
    updateMarginBox(role);
  };

  void mountNavbar();
}
