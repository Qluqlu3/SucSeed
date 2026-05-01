// frontend/spa/session.ts
//
// DOM / fetch アクセスを伴う副作用関数。
// 型定義・型ガード（純粋関数）は sessionTypes.ts に分離している。

import { getJson } from '../utils/getJson';
import {
  type ArtCategory,
  EMPTY_LAYOUT_ASSETS,
  isArtCategory,
  isLayoutAssets,
  isRole,
  type LayoutAssets,
  type Role,
  type SessionPayload,
} from './sessionTypes';

export const fetchSessionPayload = async (): Promise<{
  role: Role;
  artCategories: ArtCategory[];
  layoutAssets: LayoutAssets;
}> => {
  try {
    const response = await getJson('/api/session');

    if (!response.ok) {
      return { role: 'guest', artCategories: [], layoutAssets: EMPTY_LAYOUT_ASSETS };
    }

    const json = (await response.json()) as SessionPayload;
    return {
      role: isRole(json.role) ? json.role : 'guest',
      artCategories: Array.isArray(json.artCategories)
        ? json.artCategories.filter(isArtCategory)
        : [],
      layoutAssets: isLayoutAssets(json.layoutAssets) ? json.layoutAssets : EMPTY_LAYOUT_ASSETS,
    };
  } catch {
    return { role: 'guest', artCategories: [], layoutAssets: EMPTY_LAYOUT_ASSETS };
  }
};
