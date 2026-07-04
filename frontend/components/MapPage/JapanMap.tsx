// frontend/components/MapPage/JapanMap.tsx
//
// 都道府県別の職人数を塗り分けるコロプレス地図。
// PREFECTURE_SHAPES(SVGパスデータ)をベースに、件数に応じた紫の濃淡で塗り、
// ホバー/フォーカス時にツールチップで都道府県名と件数を表示する。
// タップ/ホバーどちらでも同じ情報に辿り着けるよう、選択操作はクリックとキーボード両対応。

import { useRef, useState } from 'react';
import { PREFECTURE_SHAPES } from './japanPrefectureShapes';
import { COLOR_BUCKETS, colorForCount } from './prefectureColorScale';

const VIEW_BOX = '14.35 0 436.66 515.35';

interface TooltipState {
  code: number;
  x: number;
  y: number;
}

interface Props {
  countByPrefecture: Record<number, number>;
  selectedCode: number | null;
  onSelect: (code: number | null) => void;
}

export const JapanMap = ({ countByPrefecture, selectedCode, onSelect }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const positionFromPointer = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const positionFromElement = (el: Element) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: elRect.left + elRect.width / 2 - rect.left, y: elRect.top - rect.top };
  };

  const toggleSelect = (code: number) => {
    onSelect(selectedCode === code ? null : code);
  };

  const hoveredShape = tooltip ? PREFECTURE_SHAPES.find((s) => s.code === tooltip.code) : null;

  return (
    <div>
      <div ref={containerRef} className="relative w-full">
        <svg
          viewBox={VIEW_BOX}
          className="w-full h-auto"
          role="img"
          aria-label="日本地図（都道府県別の職人数）"
        >
          {PREFECTURE_SHAPES.map((pref) => {
            const count = countByPrefecture[pref.code] ?? 0;
            const isSelected = selectedCode === pref.code;
            return (
              // biome-ignore lint/a11y/useSemanticElements: SVG path はネイティブのbutton要素にできない
              <path
                key={pref.code}
                d={pref.path}
                role="button"
                tabIndex={0}
                aria-label={`${pref.nameJa} ${count}件`}
                aria-pressed={isSelected}
                onClick={() => toggleSelect(pref.code)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSelect(pref.code);
                  }
                }}
                onMouseEnter={(e) => setTooltip({ code: pref.code, ...positionFromPointer(e) })}
                onMouseMove={(e) => setTooltip({ code: pref.code, ...positionFromPointer(e) })}
                onMouseLeave={() => setTooltip(null)}
                onFocus={(e) =>
                  setTooltip({ code: pref.code, ...positionFromElement(e.currentTarget) })
                }
                onBlur={() => setTooltip(null)}
                style={{
                  fill: colorForCount(count),
                  stroke: isSelected ? 'var(--color-p-gold)' : '#fff',
                  strokeWidth: isSelected ? 2.5 : 0.75,
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'stroke-width 0.1s, opacity 0.1s',
                  opacity: tooltip && tooltip.code !== pref.code ? 0.85 : 1,
                }}
              />
            );
          })}
        </svg>

        {hoveredShape && tooltip && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded bg-p-dark px-3 py-2 text-[14px] text-white shadow-lg whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y - 8 }}
          >
            <span className="font-bold">{hoveredShape.nameJa}</span>
            <span className="ml-2 text-p-nav">{countByPrefecture[hoveredShape.code] ?? 0}件</span>
          </div>
        )}
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {COLOR_BUCKETS.map((bucket) => (
          <div key={bucket.label} className="flex items-center gap-1.5 text-[14px] text-p-text">
            <span
              className="inline-block h-3.5 w-3.5 rounded-sm border border-p-mid"
              style={{ backgroundColor: bucket.color }}
            />
            {bucket.label}
          </div>
        ))}
      </div>
    </div>
  );
};
