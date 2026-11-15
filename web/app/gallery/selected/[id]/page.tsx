'use client';

// web/app/gallery/selected/[id]/page.tsx
//
// 作品の詳細（未ログインでも見られる）。Rails の GalleryController#selected_gallery を置き換える。
// 中身は GET /api/v1/galleries/:id（Rails 版も同じシリアライザ）で、画面は Rails 版と共用の
// SelectedGalleryPage（@sucseed/ui）。コメント欄に出す自分は GET /api/v1/profile から取る。
// 作品が存在しなければ 404 の画面を出す。

import { api, type GalleryDetail } from '@sucseed/api';
import { FlashMessages, SelectedGalleryPage } from '@sucseed/ui';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '../../../../lib/session';
import { useCurrentUser } from '../../../../lib/users';

type DetailState =
  | { status: 'loading' }
  | { status: 'loaded'; detail: GalleryDetail }
  | { status: 'not_found' }
  | { status: 'error'; message: string };

export default function SelectedGalleryRoute() {
  const { id } = useParams<{ id: string }>();
  const session = useSession();
  const currentUser = useCurrentUser(session !== null);
  const [state, setState] = useState<DetailState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    void api.galleries.show(id).then((result) => {
      if (!active) {
        return;
      }
      if (result.ok) {
        setState({ status: 'loaded', detail: result.data });
      } else if (result.error.code === 'not_found') {
        setState({ status: 'not_found' });
      } else {
        setState({ status: 'error', message: result.error.message });
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

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
      key={state.detail.galleryId}
      {...state.detail}
      loggedIn={session.role !== 'guest'}
      currentUser={currentUser}
      flash={{}}
    />
  );
}
