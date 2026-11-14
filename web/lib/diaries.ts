'use client';

// web/lib/diaries.ts
//
// 日記の画面（web/app/diary/**）で使う取得処理。

import { api, type DiaryFeedItem, type Id, type Profile } from '@sucseed/api';
import { useEffect, useState } from 'react';
import { fetchAllPages } from './pagination';
import { isAuthError, redirectToLogin } from './session';

/**
 * ログイン中の自分（コメント欄のアバター・名前と、自分の投稿かの判定に使う）。
 * enabled になるまで取得しない。取得中は undefined、未ログインなら null
 * （未ログインでも開ける画面があるので、ここではログイン画面へ移さない）。
 */
export const useCurrentUser = (enabled: boolean): Profile | null | undefined => {
  const [user, setUser] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let active = true;
    void api.profile.show().then((result) => {
      if (active) {
        setUser(result.ok ? result.data : null);
      }
    });
    return () => {
      active = false;
    };
  }, [enabled]);

  return user;
};

/**
 * 日記を全件取得する。userId を渡せばその人の日記、渡さなければ自分 + お気に入りの相手のフィード。
 * enabled になるまで取得しない。取得中は diaries・error とも null。
 * フィード（ログイン必須）で 401 が返ったときはログイン画面へ移す。
 */
export const useAllDiaries = (
  enabled: boolean,
  userId?: Id,
): { diaries: DiaryFeedItem[] | null; error: string | null } => {
  const [diaries, setDiaries] = useState<DiaryFeedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let active = true;
    setDiaries(null);
    setError(null);
    void fetchAllPages((params) => api.diaries.index({ ...params, userId })).then((result) => {
      if (!active) {
        return;
      }
      if (result.ok) {
        setDiaries(result.data);
      } else if (isAuthError(result.error)) {
        redirectToLogin();
      } else {
        setError(result.error.message);
      }
    });
    return () => {
      active = false;
    };
  }, [enabled, userId]);

  return { diaries, error };
};
