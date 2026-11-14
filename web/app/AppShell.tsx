'use client';

// web/app/AppShell.tsx
//
// Rails のレイアウト（app/views/layouts/application.html.erb）と同じ枠を Next の画面に付ける。
// Navbar・Footer・ログインモーダルは Rails 側と共用の @sucseed/ui の部品をそのまま使う。

import { Footer, LoginModal, Navbar, PendingFlash } from '@sucseed/ui';
import type { ReactNode } from 'react';
import { SessionProvider, useSession } from '../lib/session';

const Header = () => {
  const session = useSession();
  // Rails 側と同じく、セッションを取得してから描画する（ログイン/ログアウトの出し分けのため）
  if (!session) {
    return null;
  }
  return (
    <Navbar
      role={session.role}
      artCategories={session.artCategories}
      logoSrc={session.layoutAssets.logoSrc}
      titleSrc={session.layoutAssets.titleSrc}
    />
  );
};

// Rails 側の spa-margin-box（frontend/spa/updateMarginBox.ts）と同じ。ログイン中だけ余白を入れる
const MarginBox = () => {
  const session = useSession();
  return <div className={session && session.role !== 'guest' ? 'none-margin-box' : ''} />;
};

export const AppShell = ({ children }: { children: ReactNode }) => (
  <SessionProvider>
    <LoginModal />
    <PendingFlash />
    <header>
      <Header />
    </header>
    <div className="w-full">{children}</div>
    <MarginBox />
    <Footer />
  </SessionProvider>
);
