type Role = 'creator' | 'heir' | 'user' | 'guest';
type ArtCategory = { id: number; name: string };
type LayoutAssets = { logoSrc: string; titleSrc: string };

type SessionPayload = {
  role?: unknown;
  artCategories?: unknown;
  layoutAssets?: unknown;
};

const EMPTY_LAYOUT_ASSETS: LayoutAssets = { logoSrc: '', titleSrc: '' };

const isRole = (value: unknown): value is Role =>
  value === 'creator' || value === 'heir' || value === 'user' || value === 'guest';

const isArtCategory = (value: unknown): value is ArtCategory => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const category = value as { id?: unknown; name?: unknown };
  return typeof category.id === 'number' && typeof category.name === 'string';
};

const isLayoutAssets = (value: unknown): value is LayoutAssets => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const assets = value as { logoSrc?: unknown; titleSrc?: unknown };
  return typeof assets.logoSrc === 'string' && typeof assets.titleSrc === 'string';
};

export type { ArtCategory, LayoutAssets, Role };

export const fetchSessionPayload = async (): Promise<{
  role: Role;
  artCategories: ArtCategory[];
  layoutAssets: LayoutAssets;
}> => {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });

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
