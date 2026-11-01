import type { ReactNode } from 'react';

// 移行した画面だけがこのレイアウトを通る。未移行の画面は Rails のレイアウトのまま表示される。
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
