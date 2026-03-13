// frontend/application.ts
//
// esbuild のエントリーポイント。
// ここで import したものが app/assets/builds/application.js にバンドルされ
// layouts/application.html.erb の javascript_include_tag で読み込まれる。
//
// 【モノレポ移行時の変更点】
//   このファイルを frontend/src/main.tsx に移動し、
//   Rails 側は API レスポンスのみ返すように変更する。

import './components/mount';
