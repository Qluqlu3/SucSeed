// frontend/components/CreatorProfileTabs/CreatorProfileTabs.tsx
//
// 職人ページ(プロフィール/日記/作品ギャラリー)を行き来するための共通タブナビゲーション。
// YourPage / YourDiaryPage / UserGalleryViewPage の3ページ間で使い回す。
// どのページからでも他の2ページへ迷わず移動できるようにする。

import { BookOpen, Image as ImageIcon, User } from 'lucide-react';

export type CreatorProfileTabKey = 'profile' | 'diary' | 'gallery';

interface Props {
  targetUserId: number | string;
  active: CreatorProfileTabKey;
}

const TABS: Array<{
  key: CreatorProfileTabKey;
  label: string;
  icon: typeof User;
  hrefPrefix: string;
}> = [
  { key: 'profile', label: 'プロフィール', icon: User, hrefPrefix: '/page/creator/' },
  { key: 'diary', label: '日記', icon: BookOpen, hrefPrefix: '/diary/show/' },
  { key: 'gallery', label: '作品ギャラリー', icon: ImageIcon, hrefPrefix: '/gallery/view/' },
];

export const CreatorProfileTabs = ({ targetUserId, active }: Props) => (
  <ul className="flex flex-wrap justify-center gap-2 bg-p-dark px-[2%] py-3">
    {TABS.map(({ key, label, icon: Icon, hrefPrefix }) => {
      const isActive = key === active;
      return (
        <li key={key}>
          <a
            href={`${hrefPrefix}${targetUserId}`}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[20px] transition ${
              isActive ? 'bg-p-gold text-white' : 'text-white hover:bg-p-brand'
            }`}
          >
            <Icon size={20} />
            {label}
          </a>
        </li>
      );
    })}
  </ul>
);
