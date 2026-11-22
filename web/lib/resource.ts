'use client';

// web/lib/resource.ts
//
// :id で1件を取る画面（:id の人・作品・職人/後継者のページ）の取得状態。
// API が not_found を返したら画面から notFound() を呼んで 404 の画面を出す。

import type { ApiResult } from '@sucseed/api';
import { useEffect, useState } from 'react';

export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'not_found' }
  | { status: 'error'; code: string; message: string };

/**
 * key が変わるたびに load(key) を呼び直す。load には api.users.show のような
 * 変わらない関数を渡す（描画のたびに作る関数を渡すと取り直し続ける）。
 * enabled が false の間は取得せず loading のまま（ログイン・ロールの確認を待つときに使う）
 */
export const useResource = <T>(
  key: string,
  load: (key: string) => Promise<ApiResult<T>>,
  enabled = true,
): ResourceState<T> => {
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading' });

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let active = true;
    setState({ status: 'loading' });
    void load(key).then((result) => {
      if (!active) {
        return;
      }
      if (result.ok) {
        setState({ status: 'loaded', data: result.data });
      } else if (result.error.code === 'not_found') {
        setState({ status: 'not_found' });
      } else {
        setState({ status: 'error', code: result.error.code, message: result.error.message });
      }
    });
    return () => {
      active = false;
    };
  }, [key, load, enabled]);

  return state;
};
