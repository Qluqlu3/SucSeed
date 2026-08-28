// frontend/components/MyGalleryPage/MyGalleryPage.tsx
//
// /gallery/my_gallery ページ（マイギャラリー）の React コンポーネント。
// 右カラムの投稿フォームは POST /api/v1/galleries を叩き、
// 成功したら API が返した作品をそのまま一覧の先頭に差し込む（再読み込み不要）。

import { useState } from 'react';
import { FlashMessages } from '../FlashMessages';
import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';
import { GalleryUploadForm } from '../GalleryUploadForm';

interface Props {
  galleries: GalleryItem[];
  errors: string[];
  flash: Record<string, string>;
}

export const MyGalleryPage = ({ galleries: initialGalleries, errors, flash }: Props) => {
  const [galleries, setGalleries] = useState<GalleryItem[]>(initialGalleries);

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">マイギャラリー</h1>

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
          {/* 左カラム：ギャラリー一覧 */}
          <div className="w-full lg:w-9/12 p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]">
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

          {/* 右カラム：投稿フォーム */}
          <div className="w-full sm:w-3/12 m-0 mb-[10%] px-[0.8%]">
            <GalleryUploadForm
              onUploaded={(gallery) => setGalleries((prev) => [gallery, ...prev])}
            />
          </div>
        </div>
      </div>
    </>
  );
};
