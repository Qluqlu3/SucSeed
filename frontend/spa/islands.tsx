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
type ArtCategory = { id: number; name: string };
type SessionPayload = {
  role?: unknown;
  artCategories?: unknown;
};

const isRole = (value: unknown): value is Role =>
  value === 'creator' || value === 'heir' || value === 'user' || value === 'guest';

const isArtCategory = (value: unknown): value is ArtCategory => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const category = value as { id?: unknown; name?: unknown };
  return typeof category.id === 'number' && typeof category.name === 'string';
};

const fetchSessionPayload = async (): Promise<{ role: Role; artCategories: ArtCategory[] }> => {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return { role: 'guest', artCategories: [] };
    }
    const json = (await response.json()) as SessionPayload;
    return {
      role: isRole(json.role) ? json.role : 'guest',
      artCategories: Array.isArray(json.artCategories)
        ? json.artCategories.filter(isArtCategory)
        : [],
    };
  } catch {
    return { role: 'guest', artCategories: [] };
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
  const logoSrc = navbarEl.dataset.logoSrc ?? '';
  const titleSrc = navbarEl.dataset.titleSrc ?? '';

  const mountNavbar = async () => {
    const { role, artCategories } = await fetchSessionPayload();
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
