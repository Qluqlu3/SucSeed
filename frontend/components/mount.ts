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
import { HelloReact } from './HelloReact';
import { IndexPage } from './IndexPage';
import { UserRegistPage } from './UserRegistPage';
import { PasswordForgotPage } from './PasswordForgotPage';
import { PasswordResetPage } from './PasswordResetPage';
import { EmailCertifiedPage } from './EmailCertifiedPage';
import { MyPage } from './MyPage';
import { MyPageUpdatePage } from './MyPageUpdatePage';
import { YourPage } from './YourPage';
import { HeirPage } from './HeirPage';
import { DiarySelectPage } from './DiarySelectPage';
import { DiaryPostPage } from './DiaryPostPage';
import { MyDiaryPage } from './MyDiaryPage';
import { YourDiaryPage } from './YourDiaryPage';
import { DiaryHeirFavoritePage } from './DiaryHeirFavoritePage';
import { GalleryCard } from './GalleryCard';
import { GalleryViewPage } from './GalleryViewPage';
import { UserGalleryViewPage } from './UserGalleryViewPage';
import { MyGalleryPage } from './MyGalleryPage';
import { SelectedGalleryPage } from './SelectedGalleryPage';
import { GallerySearchPage } from './GallerySearchPage';
import { FavoriteGalleryPage } from './FavoriteGalleryPage';

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
