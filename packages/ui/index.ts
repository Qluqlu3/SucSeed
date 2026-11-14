// packages/ui/index.ts
//
// Rails に同梱している画面（frontend/）と Next.js（web/）の両方で使う UI 部品。
// 移行中は同じヘッダー・フッター・一覧の枠を両方で出すため、ここに1つだけ置く。
// 画面固有のコンポーネントは移した側（web/）に置き、ここには共通部品だけを入れる。
//
// スタイルは Tailwind のクラスで書いており、テーマとプロジェクト固有のクラスは
// styles/sucseed.css（'@sucseed/ui/styles.css'）にある。使う側の Tailwind で読み込み、
// このパッケージのファイルを @source に含めること。

export { FlashMessages } from './components/FlashMessages';
export { AnswerButtons, type MatchListUser, MatchUserList } from './components/MatchUserList';
export { PendingFlash } from './components/PendingFlash';
export { PostForm } from './components/PostForm';
export { calcAge, timeAgo } from './date';
export { type Flash, type FlashKind, pushFlash, takeFlash } from './flash';
export { Footer } from './layout/Footer';
export { LoginModal } from './layout/LoginModal';
export { Navbar } from './layout/Navbar';
export { fetchSessionPayload, type SessionState } from './layout/session';
export type { ArtCategory, LayoutAssets, Role } from './layout/sessionTypes';
