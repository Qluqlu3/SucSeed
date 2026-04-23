// app/javascript/components/mount.ts
//
// ERB のページに埋め込まれた <div data-react-component="..."> を探して
// 対応する React コンポーネントを自動的にマウントする仕組み。
//
// 使い方（ERB 側）:
//   <div data-react-component="HelloReact" data-props='{"name":"世界"}'></div>
//
// 【この仕組みの利点】
//   - ERB への変更が最小限（div を置くだけ）
//   - どのページでも同じ書き方でコンポーネントをマウントできる
//   - モノレポ移行時はこのファイルを削除し、
//     frontend 側で React Router を使ったフルSPA に切り替える

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminCreatePage } from './AdminCreatePage';
import { AdminDiaryCommentEditPage } from './AdminDiaryCommentEditPage';
import { AdminDiaryEditPage } from './AdminDiaryEditPage';
import { AdminGalleryEditPage } from './AdminGalleryEditPage';
import { AdminIndexPage } from './AdminIndexPage';
import { AdminInquiryDetailPage } from './AdminInquiryDetailPage';
import { AdminInquiryEditPage } from './AdminInquiryEditPage';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminSelectedUserEditPage } from './AdminSelectedUserEditPage';
import { AdminUserEditPage } from './AdminUserEditPage';
import { AppealedListPage } from './AppealedListPage';
import { AppealShowPage } from './AppealShowPage';
import { CertifyPage } from './CertifyPage';
import { CreatorCreatePage } from './CreatorCreatePage';
import { CreatorShowPage } from './CreatorShowPage';
import { CreatorUpdatePage } from './CreatorUpdatePage';
import { CreatorUploadImagePage } from './CreatorUploadImagePage';
import { DiaryHeirFavoritePage } from './DiaryHeirFavoritePage';
import { DiaryPostPage } from './DiaryPostPage';
import { DiarySelectPage } from './DiarySelectPage';
import { EmailCertifiedPage } from './EmailCertifiedPage';
import { Error404Page } from './Error404Page';
import { Error500Page } from './Error500Page';
import { FavoriteGalleryPage } from './FavoriteGalleryPage';
import { GallerySearchPage } from './GallerySearchPage';
import { GalleryUploadPage } from './GalleryUploadPage';
import { GalleryViewPage } from './GalleryViewPage';
import { HeirCreatePage } from './HeirCreatePage';
import { HeirFavoriteGalleryPage } from './HeirFavoriteGalleryPage';
import { HeirPage } from './HeirPage';
import { HeirShowPage } from './HeirShowPage';
import { HeirUpdatePage } from './HeirUpdatePage';
import { HelloReact } from './HelloReact';
import { IndexPage } from './IndexPage';
import { MatchingPage } from './MatchingPage';
import { MessageListPage } from './MessageListPage';
import { MessagePage } from './MessagePage';
import { MyDiaryPage } from './MyDiaryPage';
import { MyGalleryPage } from './MyGalleryPage';
import { MyPage } from './MyPage';
import { MyPageUpdatePage } from './MyPageUpdatePage';
import { PasswordForgotPage } from './PasswordForgotPage';
import { PasswordResetPage } from './PasswordResetPage';
import { ScoutCheckPage } from './ScoutCheckPage';
import { ScoutShowPage } from './ScoutShowPage';
import { SelectedGalleryPage } from './SelectedGalleryPage';
import { UserGalleryViewPage } from './UserGalleryViewPage';
import { UserRegistPage } from './UserRegistPage';
import { YourDiaryPage } from './YourDiaryPage';
import { YourPage } from './YourPage';

// JSON.parse の戻り値は any なので、ジェネリクス関数を経由すると
// ComponentType<P> に as なしで渡せる。
// 型の不確かな境界をこの関数一箇所に集約する。
// P extends object: React の createElement が内部で要求する制約と揃える
function mount<P extends object>(Component: React.ComponentType<P>, node: HTMLElement): void {
  // JSON.parse は any を返す → P への代入が型安全に通る
  const props = node.dataset.props ? JSON.parse(node.dataset.props) : {};
  createRoot(node).render(createElement(Component, props));
}

// コンポーネント名 → マウント関数のマッピング
// 新しいコンポーネントを追加したらここに登録する
type MountFn = (node: HTMLElement) => void;

const COMPONENTS: Record<string, MountFn> = {
  HelloReact: (node) => mount(HelloReact, node),
  IndexPage: (node) => mount(IndexPage, node),
  UserRegistPage: (node) => mount(UserRegistPage, node),
  PasswordForgotPage: (node) => mount(PasswordForgotPage, node),
  PasswordResetPage: (node) => mount(PasswordResetPage, node),
  EmailCertifiedPage: (node) => mount(EmailCertifiedPage, node),
  MyPage: (node) => mount(MyPage, node),
  MyPageUpdatePage: (node) => mount(MyPageUpdatePage, node),
  YourPage: (node) => mount(YourPage, node),
  HeirPage: (node) => mount(HeirPage, node),
  DiarySelectPage: (node) => mount(DiarySelectPage, node),
  DiaryPostPage: (node) => mount(DiaryPostPage, node),
  MyDiaryPage: (node) => mount(MyDiaryPage, node),
  YourDiaryPage: (node) => mount(YourDiaryPage, node),
  DiaryHeirFavoritePage: (node) => mount(DiaryHeirFavoritePage, node),
  GalleryViewPage: (node) => mount(GalleryViewPage, node),
  UserGalleryViewPage: (node) => mount(UserGalleryViewPage, node),
  MyGalleryPage: (node) => mount(MyGalleryPage, node),
  SelectedGalleryPage: (node) => mount(SelectedGalleryPage, node),
  GallerySearchPage: (node) => mount(GallerySearchPage, node),
  FavoriteGalleryPage: (node) => mount(FavoriteGalleryPage, node),
  HeirFavoriteGalleryPage: (node) => mount(HeirFavoriteGalleryPage, node),
  GalleryUploadPage: (node) => mount(GalleryUploadPage, node),
  CertifyPage: (node) => mount(CertifyPage, node),
  CreatorCreatePage: (node) => mount(CreatorCreatePage, node),
  CreatorShowPage: (node) => mount(CreatorShowPage, node),
  CreatorUpdatePage: (node) => mount(CreatorUpdatePage, node),
  CreatorUploadImagePage: (node) => mount(CreatorUploadImagePage, node),
  HeirCreatePage: (node) => mount(HeirCreatePage, node),
  HeirShowPage: (node) => mount(HeirShowPage, node),
  HeirUpdatePage: (node) => mount(HeirUpdatePage, node),
  Error404Page: (node) => mount(Error404Page, node),
  Error500Page: (node) => mount(Error500Page, node),
  MatchingPage: (node) => mount(MatchingPage, node),
  AppealShowPage: (node) => mount(AppealShowPage, node),
  AppealedListPage: (node) => mount(AppealedListPage, node),
  ScoutCheckPage: (node) => mount(ScoutCheckPage, node),
  ScoutShowPage: (node) => mount(ScoutShowPage, node),
  MessagePage: (node) => mount(MessagePage, node),
  MessageListPage: (node) => mount(MessageListPage, node),
  AdminLoginPage: (node) => mount(AdminLoginPage, node),
  AdminCreatePage: (node) => mount(AdminCreatePage, node),
  AdminIndexPage: (node) => mount(AdminIndexPage, node),
  AdminUserEditPage: (node) => mount(AdminUserEditPage, node),
  AdminDiaryEditPage: (node) => mount(AdminDiaryEditPage, node),
  AdminDiaryCommentEditPage: (node) => mount(AdminDiaryCommentEditPage, node),
  AdminGalleryEditPage: (node) => mount(AdminGalleryEditPage, node),
  AdminInquiryEditPage: (node) => mount(AdminInquiryEditPage, node),
  AdminInquiryDetailPage: (node) => mount(AdminInquiryDetailPage, node),
  AdminSelectedUserEditPage: (node) => mount(AdminSelectedUserEditPage, node),
};

document.addEventListener('DOMContentLoaded', () => {
  // data-react-component 属性を持つ要素を全て取得
  const nodes = document.querySelectorAll<HTMLElement>('[data-react-component]');

  nodes.forEach((node) => {
    const name = node.dataset.reactComponent;
    if (!name) return;

    const mountFn = COMPONENTS[name];

    if (!mountFn) {
      // biome-ignore lint/suspicious/noConsole: 開発者向けのデバッグ警告（意図的）
      console.warn(
        `[React] コンポーネント "${name}" が見つかりません。mount.ts の COMPONENTS に追加してください。`,
      );
      return;
    }

    // React 18 の createRoot API でマウント
    mountFn(node);
  });
});
