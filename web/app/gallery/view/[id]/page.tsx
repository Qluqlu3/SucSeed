'use client';

// web/app/gallery/view/[id]/page.tsx
//
// :id の人のギャラリー（未ログインでも見られる）。Rails の GalleryController#user_view を置き換える。
// 見出しの名前は GET /api/v1/users/:id、作品は GET /api/v1/galleries?user_id=:id。
// 職人ページへのタブは Rails と同じく常に出す（日記の画面と違い、詳細プロフィールの有無を見ていなかった）。
// ユーザーが存在しなければ 404 の画面を出す。

import { CreatorProfileTabs, FlashMessages } from '@sucseed/ui';
import { notFound, useParams } from 'next/navigation';
import { useAllGalleries } from '../../../../lib/galleries';
import { usePublicUser } from '../../../../lib/users';
import { GalleryCards } from '../../_components/GalleryCards';
import { TagSearchForm } from '../../_components/TagSearchForm';

export default function UserGalleryViewPage() {
  const { id } = useParams<{ id: string }>();
  const owner = usePublicUser(id);
  const { galleries, error } = useAllGalleries(owner.status === 'loaded', { userId: id });

  if (owner.status === 'not_found') {
    notFound();
  }

  if (owner.status === 'error') {
    return <FlashMessages flash={{ danger: owner.message }} />;
  }

  if (owner.status === 'loading' || (galleries === null && error === null)) {
    return null;
  }

  const items = galleries ?? [];

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
        {owner.data.name}さんのギャラリー
      </h1>

      <CreatorProfileTabs targetUserId={id} active="gallery" />

      <FlashMessages flash={error ? { danger: error } : {}} />

      {items.length > 0 && <TagSearchForm userId={id} />}

      <div className="flex flex-wrap min-h-[70vh] m-0 py-0 px-[0.7%] w-full">
        <div className="w-full p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]">
          {items.length === 0 ? (
            <div className="h-[50vh]">
              <p className="mt-[10%] ml-[15%] text-[39px] text-white">まだありません</p>
            </div>
          ) : (
            <GalleryCards galleries={items} />
          )}
        </div>
      </div>
    </>
  );
}
