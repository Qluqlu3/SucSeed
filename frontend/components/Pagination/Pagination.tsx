// frontend/components/Pagination/Pagination.tsx
//
// 番号付きページネーションの共通UI。
// リンクはbuildHrefが生成する通常のURL(?page=N)で、クリックすると
// フルページ遷移してRails側の該当アクションが新しいpage_propsを返す。

import type { FC } from 'react';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface Props {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

interface GapItem {
  gapAfterPage: number;
}
type SeriesItem = number | GapItem;

const isGap = (item: SeriesItem): item is GapItem => typeof item === 'object';

// 1, {gap}, 4, 5, 6, {gap}, 20 のような表示用のページ番号列を組み立てる
function buildSeries(currentPage: number, totalPages: number, windowSize = 2): SeriesItem[] {
  const pages = new Set<number>([1, totalPages]);
  for (let p = currentPage - windowSize; p <= currentPage + windowSize; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const series: SeriesItem[] = [];
  let prev: number | null = null;
  for (const page of sorted) {
    if (prev !== null && page - prev > 1) series.push({ gapAfterPage: prev });
    series.push(page);
    prev = page;
  }
  return series;
}

const linkClass = (active: boolean) =>
  `min-w-[2.5rem] rounded px-3 py-2 text-center ${
    active ? 'bg-p-brand text-white' : 'text-p-text hover:bg-p-pale'
  }`;

export const Pagination: FC<Props> = ({ currentPage, totalPages, buildHref }) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1 py-6"
      aria-label="ページネーション"
    >
      <a
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        className={`${linkClass(false)} ${currentPage <= 1 ? 'pointer-events-none opacity-40' : ''}`}
      >
        前へ
      </a>

      {buildSeries(currentPage, totalPages).map((item) =>
        isGap(item) ? (
          <span key={`gap-${item.gapAfterPage}`} className="px-2 text-p-muted">
            …
          </span>
        ) : (
          <a
            key={item}
            href={buildHref(item)}
            aria-current={item === currentPage ? 'page' : undefined}
            className={linkClass(item === currentPage)}
          >
            {item}
          </a>
        ),
      )}

      <a
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage >= totalPages}
        className={`${linkClass(false)} ${currentPage >= totalPages ? 'pointer-events-none opacity-40' : ''}`}
      >
        次へ
      </a>
    </nav>
  );
};
