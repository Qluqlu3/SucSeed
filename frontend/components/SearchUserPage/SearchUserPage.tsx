// frontend/components/SearchUserPage/SearchUserPage.tsx
//
// /index/search_user ページ全体の React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   creators : 検索結果の職人一覧

import type { Creator } from '../CreatorCard';
import { CreatorCard } from '../CreatorCard';
import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface Props {
  creators: Creator[];
  flash: Record<string, string>;
}

// ── コンポーネント ───────────────────────────────────────────────────

export const SearchUserPage = ({ creators, flash }: Props) => (
  <>
    <FlashMessages flash={flash} />
    <div className="min-h-[95vh] mt-[3%]">
      <div className="flex flex-wrap justify-center w-full m-0">
        {creators.map((creator) => (
          <CreatorCard key={creator.userId} creator={creator} />
        ))}
        <div className="w-full mt-[5%]" />
      </div>
    </div>
  </>
);
