// packages/ui/flash.ts
//
// 画面をまたいで1回だけ出すメッセージ（Rails の flash に当たるもの）をブラウザ側で持つ。
//
// Rails の flash は Rails のセッションにあり、Next の画面からは読み書きできない。
// Next の画面で操作した結果を遷移先に伝えるときはここに積み、遷移先が1回だけ取り出す。
// 遷移先が Rails の画面でも出るよう、Rails のレイアウトにも取り出して表示する island を置いている
// （PendingFlash。Rails 側は frontend/spa/islands.tsx の spa-flash）。
//
// キーは Rails の flash と同じ success / danger / information を使い、FlashMessages でそのまま描画する。

export type FlashKind = 'success' | 'danger' | 'information';
export type Flash = Partial<Record<FlashKind, string>>;

const STORAGE_KEY = 'sucseed:flash';

const isFlash = (value: unknown): value is Flash =>
  typeof value === 'object' &&
  value !== null &&
  Object.values(value).every((message) => typeof message === 'string');

export const pushFlash = (kind: FlashKind, message: string): void => {
  try {
    const current = readFlash();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, [kind]: message }));
  } catch {
    // ストレージが使えない環境（プライベートモードの一部など）ではメッセージを諦める
  }
};

/** 積まれているメッセージを取り出して消す。無ければ空のオブジェクト */
export const takeFlash = (): Flash => {
  try {
    const flash = readFlash();
    sessionStorage.removeItem(STORAGE_KEY);
    return flash;
  } catch {
    return {};
  }
};

const readFlash = (): Flash => {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isFlash(parsed) ? parsed : {};
  } catch {
    return {};
  }
};
