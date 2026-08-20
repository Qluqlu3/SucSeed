// frontend/spa/sessionTypes.ts
//
// session に関する型ガード（純粋関数）。
// 型そのものは API クライアント側（frontend/api/types.ts）を唯一の定義とし、
// ここでは re-export するだけにして二重管理を避ける。
//
// レイアウト（Navbar / Footer）はページ描画の土台なので、
// レスポンスが想定と違っても落とさず 'guest' 相当にフォールバックできるよう、
// 型だけでなく実行時の検証も持っている。

import type { ArtCategory, LayoutAssets, Role } from '../api/types';

export type { ArtCategory, LayoutAssets, Role } from '../api/types';

/** fetch 結果は any 相当なので、検証前は unknown として扱う */
export interface SessionPayloadLike {
  role?: unknown;
  artCategories?: unknown;
  layoutAssets?: unknown;
}

export const EMPTY_LAYOUT_ASSETS: LayoutAssets = { logoSrc: '', titleSrc: '' };

export const isRole = (value: unknown): value is Role =>
  value === 'creator' || value === 'heir' || value === 'user' || value === 'guest';

export const isArtCategory = (value: unknown): value is ArtCategory => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const category = value as { id?: unknown; name?: unknown };
  return typeof category.id === 'number' && typeof category.name === 'string';
};

export const isLayoutAssets = (value: unknown): value is LayoutAssets => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const assets = value as { logoSrc?: unknown; titleSrc?: unknown };
  return typeof assets.logoSrc === 'string' && typeof assets.titleSrc === 'string';
};
