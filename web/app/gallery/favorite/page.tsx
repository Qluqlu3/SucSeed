'use client';

// web/app/gallery/favorite/page.tsx
//
// 自分 + お気に入りの相手のギャラリー。Rails の GalleryController#favorite_gallery を置き換える。
// 一覧は GET /api/v1/galleries（user_id 無し）、右の投稿フォームはマイギャラリーと同じ GalleryUploadForm。
// Rails と同じくログインだけを求め、ロールは見ない（職人でなければ投稿は API が断り、フォームにエラーが出る）。

import { FlashMessages, GalleryUploadForm } from '@sucseed/ui';
import { useAllGalleries } from '../../../lib/galleries';
import { useRequireLogin } from '../../../lib/session';
import { GalleryCards } from '../_components/GalleryCards';

export default function FavoriteGalleryPage() {
  const loggedIn = useRequireLogin() !== null;
  const { galleries, setGalleries, error } = useAllGalleries(loggedIn);

  if (!loggedIn || (galleries === null && error === null)) {
    return null;
  }

  const items = galleries ?? [];

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">ギャラリー</h1>

      <FlashMessages flash={error ? { danger: error } : {}} />

      <div className="min-h-screen">
        <div className="flex flex-wrap m-0 p-0">
          <div className="w-full md:w-3/4 p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]">
            {items.length === 0 ? (
              <p className="mt-[10%] ml-[15%] text-[39px] text-white">まだありません</p>
            ) : (
              <GalleryCards galleries={items} />
            )}
          </div>

          <div className="w-full md:w-1/4 m-0 mb-[10%] px-[0.8%]">
            <GalleryUploadForm
              onUploaded={(gallery) => setGalleries((prev) => [gallery, ...(prev ?? [])])}
            />
          </div>
        </div>
      </div>
    </>
  );
}
