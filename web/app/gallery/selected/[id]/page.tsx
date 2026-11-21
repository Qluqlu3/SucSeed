'use client';

// web/app/gallery/selected/[id]/page.tsx
//
// 作品の詳細（未ログインでも見られる）。Rails の GalleryController#selected_gallery を置き換える。
// 中身は GET /api/v1/galleries/:id（Rails 版も同じシリアライザ）で、画面は Rails 版と共用の
// SelectedGalleryPage（@sucseed/ui）。コメント欄に出す自分は GET /api/v1/profile から取る。
// 作品が存在しなければ 404 の画面を出す。

import { api } from '@sucseed/api';
import { FlashMessages, SelectedGalleryPage } from '@sucseed/ui';
import { notFound, useParams } from 'next/navigation';
import { useResource } from '../../../../lib/resource';
import { useSession } from '../../../../lib/session';
import { useCurrentUser } from '../../../../lib/users';

export default function SelectedGalleryRoute() {
  const { id } = useParams<{ id: string }>();
  const session = useSession();
  const currentUser = useCurrentUser(session !== null);
  const state = useResource(id, api.galleries.show);

  if (state.status === 'not_found') {
    notFound();
  }

  if (state.status === 'error') {
    return <FlashMessages flash={{ danger: state.message }} />;
  }

  if (state.status === 'loading' || session === null || currentUser === undefined) {
    return null;
  }

  return (
    <SelectedGalleryPage
      key={state.data.galleryId}
      {...state.data}
      loggedIn={session.role !== 'guest'}
      currentUser={currentUser}
      flash={{}}
    />
  );
}
