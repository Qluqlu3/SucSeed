'use client';

// web/lib/galleries.ts
//
// ギャラリーの画面（web/app/gallery/**）で使う取得処理。

import { api, type GalleryFeedItem, type Id } from '@sucseed/api';
import type { Dispatch, SetStateAction } from 'react';
import { useAllPages } from './pagination';

/**
 * 作品を全件取得する。userId を渡せばその人の作品（tag も渡せばタグで絞る）、
 * 渡さなければ自分 + お気に入りの相手のフィード。enabled になるまで取得しない。
 * 取得中は galleries・error とも null。投稿した作品を差し込めるよう setGalleries も返す。
 */
export const useAllGalleries = (
  enabled: boolean,
  filter: { userId?: Id; tag?: string } = {},
): {
  galleries: GalleryFeedItem[] | null;
  setGalleries: Dispatch<SetStateAction<GalleryFeedItem[] | null>>;
  error: string | null;
} => {
  const { userId, tag } = filter;
  const { items, setItems, error } = useAllPages(
    enabled ? JSON.stringify(['galleries', userId ?? null, tag ?? null]) : null,
    (params) => api.galleries.index({ ...params, userId, tag }),
  );
  return { galleries: items, setGalleries: setItems, error };
};
