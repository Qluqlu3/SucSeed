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
import './components/MyPage/mountMyPage';
import './components/MyPageUpdatePage/mountMyPageUpdatePage';
import './components/PasswordResetPage/mountPasswordResetPage';
import './components/UserRegistPage/mountUserRegistPage';
import './components/DiaryHeirFavoritePage/mountDiaryHeirFavoritePage';
import './components/DiaryPostPage/mountDiaryPostPage';
import './components/DiarySelectPage/mountDiarySelectPage';
import './components/HeirPage/mountHeirPage';
import './components/MyDiaryPage/mountMyDiaryPage';
import './components/YourDiaryPage/mountYourDiaryPage';
import './components/YourPage/mountYourPage';
import './components/Error404Page/mountError404Page';
import './components/Error500Page/mountError500Page';
import './components/InquiryInputPage/mountInquiryInputPage';
import './components/PasswordForgotPage/mountPasswordForgotPage';
import './components/SearchUserPage/mountSearchUserPage';
import './spa/islands';
