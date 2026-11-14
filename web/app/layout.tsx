import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppShell } from './AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'SucSeed',
};

// 移行した画面だけがこのレイアウトを通る。未移行の画面は Rails のレイアウトのまま表示される。
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
