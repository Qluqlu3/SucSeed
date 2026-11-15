'use client';

// web/lib/users.ts
//
// ログイン中の自分（GET /api/v1/profile）と、:id の人の公開情報（GET /api/v1/users/:id）。

import { api, type Id, type Profile, type PublicUserPage } from '@sucseed/api';
import { useEffect, useState } from 'react';

export type PublicUserState =
  | { status: 'loading' }
  | { status: 'loaded'; user: PublicUserPage }
  | { status: 'not_found' }
  | { status: 'error'; message: string };

/**
 * :id の人の公開情報。「○○さんの日記」「○○さんのギャラリー」の見出しと、職人ページへのタブを出すかに使う。
 * 存在しない・退会した人なら not_found（画面は notFound() で 404 を出す）
 */
export const usePublicUser = (userId: Id): PublicUserState => {
  const [state, setState] = useState<PublicUserState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    void api.users.show(userId).then((result) => {
      if (!active) {
        return;
      }
      if (result.ok) {
        setState({ status: 'loaded', user: result.data });
      } else if (result.error.code === 'not_found') {
        setState({ status: 'not_found' });
      } else {
        setState({ status: 'error', message: result.error.message });
      }
    });
    return () => {
      active = false;
    };
  }, [userId]);

  return state;
};

/**
 * ログイン中の自分（コメント欄のアバター・名前、自分の投稿かの判定、マイ日記・マイギャラリーの対象に使う）。
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
