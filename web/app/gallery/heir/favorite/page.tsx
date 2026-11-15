'use client';

// web/app/gallery/heir/favorite/page.tsx
//
// 自分 + お気に入りの相手のギャラリー（後継者のメニューから開く版）。Rails の
// GalleryController#heir_favorite_gallery を置き換える。/gallery/favorite と違い投稿フォームが無く、枠が全幅。
// Rails と同じくログインだけを求め、ロールは見ない。

import { FlashMessages } from '@sucseed/ui';
import { useAllGalleries } from '../../../../lib/galleries';
import { useRequireLogin } from '../../../../lib/session';
import { GalleryCards } from '../../_components/GalleryCards';

export default function HeirFavoriteGalleryPage() {
  const loggedIn = useRequireLogin() !== null;
  const { galleries, error } = useAllGalleries(loggedIn);

  if (!loggedIn || (galleries === null && error === null)) {
    return null;
  }

  const items = galleries ?? [];

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">ギャラリー</h1>

      <FlashMessages flash={error ? { danger: error } : {}} />

      <div className="flex flex-wrap m-0 p-0">
        <div className="w-full p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px] min-h-[55vh]">
          {items.length === 0 ? (
            <p className="mt-[10%] ml-[15%] text-[39px] text-white">まだありません</p>
          ) : (
            <GalleryCards galleries={items} />
          )}
        </div>
      </div>
    </>
  );
}
