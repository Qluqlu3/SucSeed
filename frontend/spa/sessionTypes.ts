// frontend/spa/sessionTypes.ts
//
// session に関する型定義と型ガード（純粋関数）。
// DOM / fetch などの副作用を持たないため、単体テストが容易。
// 副作用を伴う getCsrfToken / fetchSessionPayload は session.ts に置く。

export type Role = 'creator' | 'heir' | 'user' | 'guest';
export type ArtCategory = { id: number; name: string };
export type LayoutAssets = { logoSrc: string; titleSrc: string };

export type SessionPayload = {
  role?: unknown;
  artCategories?: unknown;
  layoutAssets?: unknown;
};

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
