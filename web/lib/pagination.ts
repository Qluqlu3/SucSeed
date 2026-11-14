// web/lib/pagination.ts
//
// 一覧 API を全ページ読んで1つの配列にする。Rails の画面は一覧を全件出していたので、
// 移した画面も当面は同じく全件を出す（ページ送りにするかは IMPROVEMENT_PLAN の 🟢-1 と合わせて決める）。

import type { ApiResult, Collection, PageParams } from '@sucseed/api';

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
