// frontend/components/MapPage/TraditionalCraftCard.tsx
//
// 都道府県の代表的な伝統工芸品を紹介するカード。実際の登録職人とは独立した
// 参照データ(TraditionalCraft)を表示する読み物パート。

import { ExternalLink, Image as ImageIcon, MapPin, Sparkle, Users } from 'lucide-react';

export interface TraditionalCraft {
  id: number;
  name: string;
  prefectureCode: number;
  categoryName: string | null;
  summary: string;
  features: string[];
  designatedYear: number | null;
  productionArea: string | null;
  imagePath: string | null;
  sourceUrl: string | null;
  relatedCreatorsCount: number;
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

      {craft.imagePath ? (
        <img
          src={craft.imagePath}
          className="h-40 w-full object-cover"
          width={400}
          height={160}
          alt={craft.name}
          loading="lazy"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-p-pale text-p-muted">
          <ImageIcon size={28} />
        </div>
      )}

      <div className="p-4">
        {(craft.productionArea || craft.designatedYear) && (
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-p-muted">
            {craft.productionArea && (
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {craft.productionArea}
              </span>
            )}
            {craft.designatedYear && <span>{craft.designatedYear}年指定</span>}
          </div>
        )}

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

        {(craft.relatedCreatorsCount > 0 || craft.sourceUrl) && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-p-mid pt-3 text-[13px]">
            {craft.relatedCreatorsCount > 0 ? (
              <a
                href={`/map?pref=${craft.prefectureCode}`}
                className="flex items-center gap-1 text-p-brand hover:underline"
              >
                <Users size={14} />
                この工芸品に携わる職人（{craft.relatedCreatorsCount}名）を見る
              </a>
            ) : (
              <span />
            )}
            {craft.sourceUrl && (
              <a
                href={craft.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-p-muted hover:underline"
              >
                <ExternalLink size={14} />
                出典
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
