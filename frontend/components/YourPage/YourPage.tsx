// frontend/components/YourPage/YourPage.tsx
//
// /page/creator/:id ページの React コンポーネント（職人ページ）。
// お気に入り追加/削除は fetch API で Rails に送信する。

import { useState } from 'react';
import { postJson } from '../../utils/postJson';
import { FlashMessages } from '../FlashMessages';

function calcAge(birthday: string): number {
  const today = new Date();
  const birth = new Date(birthday);
  const todayNum = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const birthNum = birth.getFullYear() * 10000 + (birth.getMonth() + 1) * 100 + birth.getDate();
  return Math.floor((todayNum - birthNum) / 10000);
}

interface User {
  id: number;
  name: string;
  avatarPath: string;
  isMan: boolean;
  birthday: string; // "YYYY-MM-DD"
}

interface Creator {
  title: string;
  establishment: number;
  employee: number;
  profile: string | null;
  isRecruitment: boolean;
}

interface Props {
  user: User;
  creator: Creator;
  artCategoryName: string;
  isFavorited: boolean;
  loggedIn: boolean;
  isOwnPage: boolean; // 自分自身のページかどうか
  isCreator: boolean; // 閲覧者が職人か
  isMatched: boolean; // アピール済みか
  targetUserId: number;
  flash: Record<string, string>;
}

export const YourPage = ({
  user,
  creator,
  artCategoryName,
  isFavorited: initialFavorited,
  loggedIn,
  isOwnPage,
  isCreator,
  isMatched: initialMatched,
  targetUserId,
  flash,
}: Props) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isMatched, setIsMatched] = useState(initialMatched);

  const handleFavorite = async () => {
    const url = isFavorited ? `/favorite/${targetUserId}/delete` : `/favorite/${targetUserId}/add`;
    await postJson(url);
    setIsFavorited(!isFavorited);
  };

  const handleAppeal = async () => {
    await postJson(`/match/send/${targetUserId}`);
    setIsMatched(true);
  };

  return (
    <div className="w-full">
      <FlashMessages flash={flash} />

      {/* プロフィールヘッダー */}
      <div>
        <div className="w-full relative mx-auto">
          <img src="/assets/main1.jpg" height="850px" width="100%" alt="背景画像" />
          <div>
            <div className="absolute top-[2%] left-[1%]">
              <h1 className="bg-[#FCF2D3] rounded-[30px] py-[6px] px-[15px] inline-block text-[67px]">
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
            <div className="absolute top-0 right-[0.7%] text-[51px]">
              {creator.isRecruitment ? (
                <span className="inline-block rounded bg-p-brand px-2 py-1 text-sm text-white">
                  募集中
                </span>
              ) : (
                <span className="inline-block rounded bg-red-600 px-2 py-1 text-sm text-white">
                  募集停止中
                </span>
              )}
            </div>
          </div>
          <div className="absolute top-[27%] left-[39%]">
            <img
              src={user.avatarPath}
              className="rounded-full object-cover"
              width="100%"
              height="100%"
              alt="アバター画像"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[50px] bg-p-brand" />

      {/* お気に入りボタン */}
      <div className="text-right mt-[1%] mr-[2%] mb-[1%]">
        {loggedIn && !isOwnPage && (
          <button
            type="button"
            className="rounded bg-p-brand px-4 py-2 text-lg text-white hover:opacity-80"
            onClick={handleFavorite}
          >
            {isFavorited ? (
              <i className="fas fa-star pt-[7%] text-p-brand text-[33px]" />
            ) : (
              <i className="far fa-star pt-[7%] text-white text-[33px]" />
            )}
          </button>
        )}
      </div>

      {/* タブナビゲーション */}
      <ul className="flex justify-center border-t border-b border-[#aaa] text-[33px] text-white bg-[#666]">
        <li className="">
          <a
            href={`/diary/show/${user.id}`}
            className="block px-4 py-2 text-white hover:text-[#FFA30D]"
          >
            日記
          </a>
        </li>
        <li className="ml-[5%]">
          <a
            href={`/gallery/view/${user.id}`}
            className="block px-4 py-2 text-white hover:text-[#FFA30D]"
          >
            ギャラリー
          </a>
        </li>
      </ul>

      {/* 制作工芸名・ジャンル */}
      <div className="w-[93%] mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2">
            <div className="mx-auto border-none bg-[#FCF2D3] mb-[25px] rounded-[11px] h-[17vh]">
              <h3 className="text-white bg-p-brand text-[25px] [border-radius:11px_11px_0_0] pt-[3%] pr-0 pb-[1%] pl-[2%]">
                制作工芸名
              </h3>
              <div className="p-[9px] text-center text-[27px]">
                <p className="text-[39px] leading-[9vh]">{creator.title}</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mx-auto border-none bg-[#FCF2D3] mb-[25px] rounded-[11px] h-[17vh]">
              <h3 className="text-white bg-p-brand text-[25px] [border-radius:11px_11px_0_0] pt-[3%] pr-0 pb-[1%] pl-[2%]">
                工芸品ジャンル
              </h3>
              <div className="p-[9px] text-center text-[27px]">
                <p className="text-[39px] leading-[9vh]">{artCategoryName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 創業年数・従業員数 */}
      <div className="w-[93%] mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2">
            <div className="mx-auto border-none bg-[#FCF2D3] mb-[25px] rounded-[11px] h-[17vh]">
              <h3 className="text-white bg-p-brand text-[25px] [border-radius:11px_11px_0_0] pt-[3%] pr-0 pb-[1%] pl-[2%]">
                創業年数
              </h3>
              <div className="p-[9px] text-center text-[27px]">
                <p className="text-[39px] leading-[9vh]">{creator.establishment}年</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mx-auto border-none bg-[#FCF2D3] mb-[25px] rounded-[11px] h-[17vh]">
              <h3 className="text-white bg-p-brand text-[25px] [border-radius:11px_11px_0_0] pt-[3%] pr-0 pb-[1%] pl-[2%]">
                従業員数
              </h3>
              <div className="p-[9px] text-center text-[27px]">
                <p className="text-[39px] leading-[9vh]">{creator.employee}人</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 紹介文 */}
      <div className="mx-auto w-[93%] bg-[#FCF2D3] rounded-[11px] mb-[5%] text-[27px] border-none">
        <h3 className="text-white bg-p-brand text-[25px] [border-radius:11px_11px_0_0] pt-[25px] pr-0 pb-[11px] pl-[21px]">
          紹介文
        </h3>
        <div className="pt-[1%] pr-0 pb-[1%] pl-[1%]">
          <p className="" style={{ whiteSpace: 'pre-wrap' }}>
            {creator.profile}
          </p>
        </div>
      </div>

      {/* アピールボタン（後継者ログイン時のみ） */}
      {loggedIn && !isCreator && (
        <div className="w-[50%] fixed bottom-0 left-[25%]">
          <button
            type="button"
            className="w-full bg-[#FFA30D] text-[33px] hover:opacity-90 rounded py-2"
            onClick={handleAppeal}
            disabled={isMatched}
          >
            {isMatched ? 'アピール済' : 'アピール'}
          </button>
        </div>
      )}
    </div>
  );
};
