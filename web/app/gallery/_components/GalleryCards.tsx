'use client';

// web/app/gallery/_components/GalleryCards.tsx
//
// ギャラリーの各画面で共通の、サムネイルを並べる部分。空のときの出し方は画面ごとに違うので呼び出し側で扱う。
// カード自体は Rails 側と共用の GalleryCard（@sucseed/ui）。

import type { GalleryFeedItem } from '@sucseed/api';
import { GalleryCard } from '@sucseed/ui';

export const GalleryCards = ({ galleries }: { galleries: GalleryFeedItem[] }) => (
  <div className="flex flex-wrap m-0 p-0">
    {galleries.map((gallery) => (
      <GalleryCard key={gallery.id} gallery={gallery} />
    ))}
  </div>
);
