'use client';

// web/lib/diaries.ts
//
// 日記の画面（web/app/diary/**）で使う取得処理。

import { api, type DiaryFeedItem, type Id } from '@sucseed/api';
import { useAllPages } from './pagination';

/**
 * 日記を全件取得する。userId を渡せばその人の日記、渡さなければ自分 + お気に入りの相手のフィード。
 * enabled になるまで取得しない。取得中は diaries・error とも null。
 * フィード（ログイン必須）で 401 が返ったときはログイン画面へ移す。
 */
export const useAllDiaries = (
  enabled: boolean,
  userId?: Id,
): { diaries: DiaryFeedItem[] | null; error: string | null } => {
  const { items, error } = useAllPages(enabled ? `diaries:${userId ?? ''}` : null, (params) =>
    api.diaries.index({ ...params, userId }),
  );
  return { diaries: items, error };
};
