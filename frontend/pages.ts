// frontend/pages.ts
//
// 画面ごとの React コンポーネントの登録表。
// Rails のテンプレートが <%= react_root 'xxx-page', @page_props %> で出力した要素に、
// 対応するコンポーネントを data-props の JSON を props としてマウントする。
// 画面を追加するときは、ここに1行足してテンプレートで同じ id を使う。

import { AdminCreatePage } from './components/AdminCreatePage';
import { AdminDiaryCommentEditPage } from './components/AdminDiaryCommentEditPage';
import { AdminDiaryEditPage } from './components/AdminDiaryEditPage';
import { AdminGalleryEditPage } from './components/AdminGalleryEditPage';
import { AdminIndexPage } from './components/AdminIndexPage';
import { AdminInquiryDetailPage } from './components/AdminInquiryDetailPage';
import { AdminInquiryEditPage } from './components/AdminInquiryEditPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminSelectedUserEditPage } from './components/AdminSelectedUserEditPage';
import { AdminUserEditPage } from './components/AdminUserEditPage';
import { AppealedListPage } from './components/AppealedListPage';
import { AppealShowPage } from './components/AppealShowPage';
import { CreatorCreatePage } from './components/CreatorCreatePage';
import { CreatorShowPage } from './components/CreatorShowPage';
import { CreatorUpdatePage } from './components/CreatorUpdatePage';
import { DiaryHeirFavoritePage } from './components/DiaryHeirFavoritePage';
import { DiaryPostPage } from './components/DiaryPostPage';
import { DiarySelectPage } from './components/DiarySelectPage';
import { EmailCertifiedPage } from './components/EmailCertifiedPage';
import { Error404Page } from './components/Error404Page';
import { Error500Page } from './components/Error500Page';
import { FavoriteGalleryPage } from './components/FavoriteGalleryPage';
import { GallerySearchPage } from './components/GallerySearchPage';
import { HeirCreatePage } from './components/HeirCreatePage';
import { HeirFavoriteGalleryPage } from './components/HeirFavoriteGalleryPage';
import { HeirPage } from './components/HeirPage';
import { HeirShowPage } from './components/HeirShowPage';
import { HeirUpdatePage } from './components/HeirUpdatePage';
import { IndexPage } from './components/IndexPage';
import { InquiryInputPage } from './components/InquiryInputPage';
import { MapPage } from './components/MapPage/MapPage';
import { MatchingPage } from './components/MatchingPage';
import { MessageListPage } from './components/MessageListPage';
import { MessagePage } from './components/MessagePage';
import { MyDiaryPage } from './components/MyDiaryPage';
import { MyGalleryPage } from './components/MyGalleryPage';
import { MyPage } from './components/MyPage';
import { MyPageUpdatePage } from './components/MyPageUpdatePage';
import { mountPage } from './components/mountPage';
import { PasswordForgotPage } from './components/PasswordForgotPage';
import { PasswordResetPage } from './components/PasswordResetPage';
import { ScoutCheckPage } from './components/ScoutCheckPage';
import { ScoutShowPage } from './components/ScoutShowPage';
import { SearchUserPage } from './components/SearchUserPage';
import { SelectedGalleryPage } from './components/SelectedGalleryPage';
import { UserGalleryViewPage } from './components/UserGalleryViewPage';
import { UserRegistPage } from './components/UserRegistPage';
import { YourDiaryPage } from './components/YourDiaryPage';
import { YourPage } from './components/YourPage';

// Admin
mountPage('admin-create-page', AdminCreatePage);
mountPage('admin-diary-comment-edit-page', AdminDiaryCommentEditPage);
mountPage('admin-diary-edit-page', AdminDiaryEditPage);
mountPage('admin-gallery-edit-page', AdminGalleryEditPage);
mountPage('admin-index-page', AdminIndexPage);
mountPage('admin-inquiry-detail-page', AdminInquiryDetailPage);
mountPage('admin-inquiry-edit-page', AdminInquiryEditPage);
mountPage('admin-login-page', AdminLoginPage);
mountPage('admin-selected-user-edit-page', AdminSelectedUserEditPage);
mountPage('admin-user-edit-page', AdminUserEditPage);
// Creator
mountPage('creator-create-page', CreatorCreatePage);
mountPage('creator-show-page', CreatorShowPage);
mountPage('creator-update-page', CreatorUpdatePage);
// Diary
mountPage('diary-heir-favorite-page', DiaryHeirFavoritePage);
mountPage('diary-post-page', DiaryPostPage);
mountPage('diary-select-page', DiarySelectPage);
mountPage('my-diary-page', MyDiaryPage);
mountPage('your-diary-page', YourDiaryPage);
// Gallery
mountPage('favorite-gallery-page', FavoriteGalleryPage);
mountPage('gallery-search-page', GallerySearchPage);
mountPage('heir-favorite-gallery-page', HeirFavoriteGalleryPage);
mountPage('my-gallery-page', MyGalleryPage);
mountPage('selected-gallery-page', SelectedGalleryPage);
mountPage('user-gallery-view-page', UserGalleryViewPage);
// Heir
mountPage('heir-create-page', HeirCreatePage);
mountPage('heir-page', HeirPage);
mountPage('heir-show-page', HeirShowPage);
mountPage('heir-update-page', HeirUpdatePage);
// Match
mountPage('appeal-show-page', AppealShowPage);
mountPage('appealed-list-page', AppealedListPage);
mountPage('matching-page', MatchingPage);
mountPage('scout-check-page', ScoutCheckPage);
mountPage('scout-show-page', ScoutShowPage);
// Message
mountPage('message-list-page', MessageListPage);
mountPage('message-page', MessagePage);
// User
mountPage('email-certified-page', EmailCertifiedPage);
mountPage('error-404-page', Error404Page);
mountPage('error-500-page', Error500Page);
mountPage('index-page', IndexPage);
mountPage('inquiry-input-page', InquiryInputPage);
mountPage('map-page', MapPage);
mountPage('my-page', MyPage);
mountPage('my-page-update-page', MyPageUpdatePage);
mountPage('password-forgot-page', PasswordForgotPage);
mountPage('password-reset-page', PasswordResetPage);
mountPage('search-user-page', SearchUserPage);
mountPage('user-regist-page', UserRegistPage);
mountPage('your-page', YourPage);
