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
import './components/CertifyPage/mountCertifyPage';
import './components/CreatorUploadImagePage/mountCreatorUploadImagePage';
import './components/EmailCertifiedPage/mountEmailCertifiedPage';
import './components/IndexPage/mountIndexPage';
import './components/Error404Page/mountError404Page';
import './components/Error500Page/mountError500Page';
import './components/InquiryInputPage/mountInquiryInputPage';
import './components/PasswordForgotPage/mountPasswordForgotPage';
import './components/SearchUserPage/mountSearchUserPage';
import './spa/islands';
