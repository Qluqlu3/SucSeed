// packages/ui/components/PendingFlash.tsx
//
// ブラウザ側に積まれた flash（../flash.ts）を、画面を開いたときに1回だけ取り出して
// ナビバーの下に重ねて出す。クリックで閉じる。
//
// 画面ごとの flash の置き場所（見出しの下など）は画面によって違うため、どの画面でも
// 同じ位置に出せるよう重ねて表示する。Rails のレイアウト（spa-flash）と Next のレイアウトの両方に置く。

import { type FC, useEffect, useState } from 'react';
import { type Flash, takeFlash } from '../flash';
import { FlashMessages } from './FlashMessages';

export const PendingFlash: FC = () => {
  const [flash, setFlash] = useState<Flash>({});

  // sessionStorage はブラウザでしか読めないので描画後に取り出す。
  // 開発時の StrictMode では effect が2回走り2回目は空になるため、空のときは上書きしない
  useEffect(() => {
    const taken = takeFlash();
    if (Object.keys(taken).length > 0) {
      setFlash(taken);
    }
  }, []);

  if (Object.keys(flash).length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      className="fixed top-[70px] left-1/2 z-40 w-[min(90%,640px)] -translate-x-1/2 text-left"
      onClick={() => setFlash({})}
      aria-label="メッセージを閉じる"
    >
      <FlashMessages flash={flash} />
    </button>
  );
};
