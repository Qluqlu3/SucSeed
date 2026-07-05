// frontend/components/MapPage/MapPage.tsx
//
// /map ページ。都道府県別に職人の分布を地図で見せ、都道府県を選ぶと
// その地域の職人一覧に絞り込める。地図のクリックに加えて、下のチップ一覧
// からも同じ操作ができるようにして、スマホでの誤タップやホバー不可環境でも
// 迷わず使えるようにしている。

import { useMemo, useState } from 'react';
import { type Creator, CreatorCard } from '../CreatorCard';
import { FlashMessages } from '../FlashMessages';
import { JapanMap } from './JapanMap';
import { PREFECTURE_SHAPES } from './japanPrefectureShapes';
import { colorForCount } from './prefectureColorScale';
import { type TraditionalCraft, TraditionalCraftCard } from './TraditionalCraftCard';

interface Props {
  creators: Creator[];
  traditionalCrafts: TraditionalCraft[];
  flash: Record<string, string>;
}

export const MapPage = ({ creators, traditionalCrafts, flash }: Props) => {
  const [selectedCode, setSelectedCode] = useState<number | null>(null);

  const countByPrefecture = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const creator of creators) {
      if (creator.prefectureCode == null) continue;
      counts[creator.prefectureCode] = (counts[creator.prefectureCode] ?? 0) + 1;
    }
    return counts;
  }, [creators]);

  const selectedShape = PREFECTURE_SHAPES.find((p) => p.code === selectedCode) ?? null;

  const visibleCreators =
    selectedCode == null ? creators : creators.filter((c) => c.prefectureCode === selectedCode);

  const visibleCrafts =
    selectedCode == null ? [] : traditionalCrafts.filter((c) => c.prefectureCode === selectedCode);

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">地図から探す</h1>

      <FlashMessages flash={flash} />

      <p className="mx-auto mb-[2%] w-[90%] text-center text-[19px] text-p-text">
        都道府県をクリック（またはタップ）すると、その地域の職人だけを表示できます。
      </p>

      <div className="mx-auto mb-[3%] w-[90%] max-w-[900px] rounded-[7px] border border-p-mid bg-p-pale p-[3%]">
        <JapanMap
          countByPrefecture={countByPrefecture}
          selectedCode={selectedCode}
          onSelect={setSelectedCode}
        />

        {/* 都道府県チップ一覧: 地図と同じ操作を、タップしやすい形でも提供する */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 border-t border-p-mid pt-4">
          {PREFECTURE_SHAPES.map((pref) => {
            const count = countByPrefecture[pref.code] ?? 0;
            const isSelected = selectedCode === pref.code;
            return (
              <button
                key={pref.code}
                type="button"
                onClick={() => setSelectedCode(isSelected ? null : pref.code)}
                className="rounded-full border px-3 py-1 text-[14px] transition"
                style={{
                  backgroundColor: colorForCount(count),
                  borderColor: isSelected ? 'var(--color-p-gold)' : 'var(--color-p-mid)',
                  borderWidth: isSelected ? 2 : 1,
                  color: count >= 4 ? '#fff' : 'var(--color-p-text)',
                }}
              >
                {pref.nameJa}
                <span className="ml-1 opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択中の都道府県の伝統工芸品紹介 */}
      {selectedShape && (
        <div className="mx-auto mb-[3%] w-[90%]">
          <h2 className="mb-2 text-[27px] font-bold text-p-text">
            {selectedShape.nameJa}の伝統工芸品
          </h2>
          {visibleCrafts.length === 0 ? (
            <p className="text-[16px] text-p-muted">この都道府県の工芸品データは準備中です。</p>
          ) : (
            <div className="flex flex-wrap -m-2">
              {visibleCrafts.map((craft) => (
                <TraditionalCraftCard key={craft.id} craft={craft} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 選択中の都道府県 / 全国一覧 */}
      <div className="mx-auto mb-[1%] flex w-[90%] items-center justify-center gap-3">
        <h2 className="text-[27px] text-p-text font-bold">
          {selectedShape
            ? `${selectedShape.nameJa}の職人（${visibleCreators.length}件）`
            : `全国の職人一覧（${visibleCreators.length}件）`}
        </h2>
        {selectedShape && (
          <button
            type="button"
            onClick={() => setSelectedCode(null)}
            className="rounded bg-p-muted px-3 py-1 text-[15px] text-white hover:opacity-80"
          >
            すべて表示に戻す
          </button>
        )}
      </div>

      <div className="flex flex-wrap justify-center w-full m-0">
        {visibleCreators.length === 0 ? (
          <p className="my-[5%] text-[23px] text-p-muted">この都道府県にはまだ登録がありません。</p>
        ) : (
          visibleCreators.map((creator) => <CreatorCard key={creator.userId} creator={creator} />)
        )}
        {visibleCreators.length > 0 && <div className="w-full mt-[5%]" />}
      </div>
    </>
  );
};
