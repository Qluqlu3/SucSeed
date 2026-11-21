// web/app/page/_components/ProfileHero.tsx
//
// 職人ページ・後継者ページの上部（背景画像に名前・性別・年齢・アバターを重ねたもの）と、
// 画面下に固定する「アピール」「スカウト」のボタン。Rails 版（frontend/components/YourPage・HeirPage）と同じ見た目。

import type { PublicUser } from '@sucseed/api';
import { calcAge } from '@sucseed/ui';
import type { ReactNode } from 'react';
import heroImage from '../../../../app/assets/images/main1.jpg';

interface ProfileHeroProps {
  user: PublicUser;
  /** 背景画像の高さ（Rails 版は職人ページ 850px・後継者ページ 800px） */
  height: string;
  /** 右上に出すバッジ（募集中・分野名など） */
  badge?: ReactNode;
}

export const ProfileHero = ({ user, height, badge }: ProfileHeroProps) => (
  <div className="w-full relative mx-auto">
    {/* biome-ignore lint/performance/noImgElement: Rails 版と同じく幅いっぱいに伸ばす背景で、最適化は要らない */}
    <img src={heroImage.src} height={height} width="100%" alt="背景画像" />
    <div className="absolute top-[2%] left-[1%]">
      <h1 className="bg-p-light rounded-[30px] py-[6px] px-[15px] inline-block text-[67px]">
        {user.name}
      </h1>
      <p
        className={`py-[3px] px-[12px] inline-block text-[27px] rounded-[17px] ${user.isMan ? 'bg-[#0A84FF] text-white' : 'bg-[#e83e8c] text-white'}`}
      >
        {user.isMan ? '男性' : '女性'}
      </p>
      <p className="py-[5px] px-[15px] inline-block text-[31px] rounded-[17px] bg-p-light">
        {calcAge(user.birthday)}歳
      </p>
    </div>
    {badge && <div className="absolute top-0 right-[0.7%] text-[51px]">{badge}</div>}
    <div className="absolute top-[27%] left-[39%]">
      {/* biome-ignore lint/performance/noImgElement: アップロード画像は Rails から中継して配るので next/image を通さない */}
      <img
        src={user.avatarPath}
        className="rounded-full object-cover"
        width="100%"
        height="100%"
        alt="アバター画像"
      />
    </div>
  </div>
);

interface FixedActionButtonProps {
  label: string;
  doneLabel: string;
  done: boolean;
  onClick: () => void;
}

/** 画面下に固定するボタン。送信済み（done）なら押せなくして doneLabel を出す */
export const FixedActionButton = ({ label, doneLabel, done, onClick }: FixedActionButtonProps) => (
  <div className="w-[50%] fixed bottom-0 left-[25%]">
    <button
      type="button"
      className="w-full bg-p-gold text-[33px] hover:opacity-90 rounded py-2"
      onClick={onClick}
      disabled={done}
    >
      {done ? doneLabel : label}
    </button>
  </div>
);

/** 見出し付きの枠（紹介文など）。Rails 版の bg-p-light の箱 */
export const ProfileSection = ({
  title,
  className = '',
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={`mx-auto w-[93%] bg-p-light rounded-[11px] mb-[5%] text-[27px] border-none ${className}`}
  >
    <h3 className="text-white bg-p-brand text-[25px] [border-radius:11px_11px_0_0] pt-[25px] pr-0 pb-[11px] pl-[21px]">
      {title}
    </h3>
    <div className="pt-[1%] pr-0 pb-[1%] pl-[1%]">{children}</div>
  </div>
);
