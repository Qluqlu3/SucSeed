// frontend/components/FavoriteGalleryPage/FavoriteGalleryPage.tsx
//
// /gallery/favorite ページ（自分 + お気に入り登録した相手のギャラリー）。
// 投稿フォームは MyGalleryPage と共通の GalleryUploadForm を使う。

import { useState } from 'react';
import { FlashMessages } from '../FlashMessages';
import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';
import { GalleryUploadForm } from '../GalleryUploadForm';

interface Props {
  galleries: GalleryItem[];
  errors: string[];
  flash: Record<string, string>;
}

export const FavoriteGalleryPage = ({ galleries: initialGalleries, errors, flash }: Props) => {
  const [galleries, setGalleries] = useState<GalleryItem[]>(initialGalleries);

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">ギャラリー</h1>

      <FlashMessages flash={flash} />

      {errors.length > 0 && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          <ul>
            {errors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="min-h-screen">
        <div className="flex flex-wrap m-0 p-0">
          <div className="w-full md:w-3/4 p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]">
            {galleries.length === 0 ? (
              <p className="mt-[10%] ml-[15%] text-[39px] text-white">まだありません</p>
            ) : (
              <div className="flex flex-wrap m-0 p-0">
                {galleries.map((gallery) => (
                  <GalleryCard key={gallery.id} gallery={gallery} />
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/4 m-0 mb-[10%] px-[0.8%]">
            <GalleryUploadForm
              onUploaded={(gallery) => setGalleries((prev) => [gallery, ...prev])}
            />
          </div>
        </div>
      </div>
    </>
  );
};
