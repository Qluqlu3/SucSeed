'use client';

// web/lib/pagination.ts
//
// 一覧 API を全ページ読んで1つの配列にする。Rails の画面は一覧を全件出していたので、
// 移した画面も当面は同じく全件を出す（ページ送りにするかは IMPROVEMENT_PLAN の 🟢-1 と合わせて決める）。

import type { ApiResult, Collection, PageParams } from '@sucseed/api';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { isAuthError, redirectToLogin } from './session';

// API の1ページの上限（Api::BaseController::MAX_PER_PAGE）
export const MAX_PER_PAGE = 100;

export const fetchAllPages = async <T>(
  fetchPage: (params: PageParams) => Promise<ApiResult<Collection<T>>>,
): Promise<ApiResult<T[]>> => {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const result = await fetchPage({ page, perPage: MAX_PER_PAGE });
    if (!result.ok) {
      return result;
    }
    items.push(...result.data.items);
    const totalPages = result.data.pagination?.totalPages ?? 1;
    if (page >= totalPages) {
      return { ok: true, data: items };
    }
  }
};

/**
 * 一覧を全件取得するフック。key が null のあいだは取得せず、key が変わったら取り直す
 * （取得条件を key に入れる。fetchPage は key と同じ条件で作られている前提で、依存には入れない）。
 * 取得中は items・error とも null。401 はログイン画面へ移す。
 * 投稿したものを差し込めるよう setItems も返す。
 */
export const useAllPages = <T>(
  key: string | null,
  fetchPage: (params: PageParams) => Promise<ApiResult<Collection<T>>>,
): {
  items: T[] | null;
  setItems: Dispatch<SetStateAction<T[] | null>>;
  error: string | null;
} => {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 上記の通り fetchPage は key で決まる
  useEffect(() => {
    if (key === null) {
      return;
    }
    let active = true;
    setItems(null);
    setError(null);
    void fetchAllPages(fetchPage).then((result) => {
      if (!active) {
        return;
      }
      if (result.ok) {
        setItems(result.data);
      } else if (isAuthError(result.error)) {
        redirectToLogin();
      } else {
        setError(result.error.message);
      }
    });
    return () => {
      active = false;
    };
  }, [key]);

  return { items, setItems, error };
};
