// frontend/spa/session.ts
//
// レイアウト（Navbar / Footer）の起動に必要なセッション情報を取得する。
// HTTP アクセスは frontend/api の型付きクライアントに委譲し、
// ここは「取得できなかったときに guest として描画する」フォールバックに専念する。
//
// 型定義・型ガード（純粋関数）は sessionTypes.ts に分離している。

import { refreshSession } from '../api';
import {
  type ArtCategory,
  EMPTY_LAYOUT_ASSETS,
  isArtCategory,
  isLayoutAssets,
  isRole,
  type LayoutAssets,
  type Role,
} from './sessionTypes';

export const fetchSessionPayload = async (): Promise<{
  role: Role;
  artCategories: ArtCategory[];
  layoutAssets: LayoutAssets;
}> => {
  // refreshSession はセッション取得に加えて CSRF トークンを API クライアントへ反映する
  const result = await refreshSession();

  if (!result.ok) {
    return { role: 'guest', artCategories: [], layoutAssets: EMPTY_LAYOUT_ASSETS };
  }

  const payload = result.data;
  return {
    role: isRole(payload.role) ? payload.role : 'guest',
    artCategories: Array.isArray(payload.artCategories)
      ? payload.artCategories.filter(isArtCategory)
      : [],
    layoutAssets: isLayoutAssets(payload.layoutAssets) ? payload.layoutAssets : EMPTY_LAYOUT_ASSETS,
  };
};
