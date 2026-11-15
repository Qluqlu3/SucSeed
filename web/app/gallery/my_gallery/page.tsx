'use client';

// web/app/gallery/my_gallery/page.tsx
//
// マイギャラリー。Rails の GalleryController#my_gallery を置き換える。
// 一覧は GET /api/v1/galleries?user_id=自分、右の投稿フォームは Rails 版と共用の GalleryUploadForm
// （POST /api/v1/galleries）。投稿した作品は API が返したものを先頭に差し込む。

import { FlashMessages, GalleryUploadForm } from '@sucseed/ui';
import { useAllGalleries } from '../../../lib/galleries';
import { useRequireLogin } from '../../../lib/session';
import { useCurrentUser } from '../../../lib/users';
import { GalleryCards } from '../_components/GalleryCards';

export default function MyGalleryPage() {
  const loggedIn = useRequireLogin() !== null;
  const currentUser = useCurrentUser(loggedIn);
  const { galleries, setGalleries, error } = useAllGalleries(Boolean(currentUser), {
    userId: currentUser?.id,
  });

  if (!loggedIn || !currentUser || (galleries === null && error === null)) {
    return null;
  }

  const items = galleries ?? [];

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">マイギャラリー</h1>

      <FlashMessages flash={error ? { danger: error } : {}} />

      <div className="min-h-screen">
        <div className="flex flex-wrap m-0 p-0">
          {/* 左カラム：ギャラリー一覧 */}
          <div className="w-full lg:w-9/12 p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]">
            {items.length === 0 ? (
              <p className="mt-[10%] ml-[15%] text-[39px] text-white">まだありません</p>
            ) : (
              <GalleryCards galleries={items} />
            )}
          </div>

          {/* 右カラム：投稿フォーム */}
          <div className="w-full sm:w-3/12 m-0 mb-[10%] px-[0.8%]">
            <GalleryUploadForm
              onUploaded={(gallery) => setGalleries((prev) => [gallery, ...(prev ?? [])])}
            />
          </div>
        </div>
      </div>
    </>
  );
}
