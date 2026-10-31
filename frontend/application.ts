// frontend/application.ts
//
// esbuild のエントリーポイント。
// ここで import したものが app/assets/builds/application.js にバンドルされ
// layouts/application.html.erb の javascript_include_tag で読み込まれる。
//
// 【モノレポ移行時の変更点】
//   このファイルを frontend/src/main.tsx に移動し、
//   Rails 側は API レスポンスのみ返すように変更する。

// ── Sentry（エラー監視） ─────────────────────────────────────────────
// DSN が meta タグにセットされている場合のみ（＝本番環境）初期化される
import './spa/sentry';

// ── ページマウント（画面 id とコンポーネントの対応は pages.ts）──────────
import './pages';

// ── SPA アイランド（レイアウト共通 UI）───────────────────────────────
// Navbar / Footer / LoginModal を全ページに island としてマウントする
import './spa/islands';
