// frontend/components/MapPage/TraditionalCraftCard.tsx
//
// 都道府県の代表的な伝統工芸品を紹介するカード。実際の登録職人とは独立した
// 参照データ(TraditionalCraft)を表示する読み物パート。

import { Sparkle } from 'lucide-react';

export interface TraditionalCraft {
  id: number;
  name: string;
  prefectureCode: number;
  categoryName: string | null;
  summary: string;
  features: string[];
}

export const TraditionalCraftCard = ({ craft }: { craft: TraditionalCraft }) => (
  <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
    <div className="h-full rounded-[7px] border border-p-mid bg-white">
      <div className="flex items-center justify-between gap-2 rounded-t-[6px] bg-p-brand px-4 py-2">
        <h4 className="text-[20px] font-bold text-white">{craft.name}</h4>
        {craft.categoryName && (
          <span className="shrink-0 rounded-full bg-p-gold px-2 py-0.5 text-[13px] text-white">
            {craft.categoryName}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[16px] leading-relaxed text-p-text">{craft.summary}</p>
        {craft.features.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {craft.features.map((feature) => (
              <li key={feature} className="flex items-start gap-1.5 text-[14px] text-p-muted">
                <Sparkle size={14} className="mt-0.5 shrink-0 text-p-gold" />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);
