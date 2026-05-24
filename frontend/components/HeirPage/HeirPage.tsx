// frontend/components/HeirPage/HeirPage.tsx
//
// /page/heir/:id ページの React コンポーネント（後継者ページ）。
// スカウト送信は fetch API で Rails に送信する。

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
  profile: string | null;
}

interface Props {
  user: User;
  artName: string | null;
  isScouted: boolean;
  loggedIn: boolean;
  isCreator: boolean;
  targetUserId: number;
  flash: Record<string, string>;
}

export const HeirPage = ({
  user,
  artName,
  isScouted: initialScouted,
  loggedIn,
  isCreator,
  targetUserId,
  flash,
}: Props) => {
  const [isScouted, setIsScouted] = useState(initialScouted);

  const handleScout = async () => {
    await postJson(`/scout/send/${targetUserId}`);
    setIsScouted(true);
  };

  return (
    <div className='min-h-screen'>
      <FlashMessages flash={flash} />

      {/* プロフィールヘッダー */}
      <div className='w-full relative mx-auto'>
        <img src='/assets/main1.jpg' height='800px' width='100%' alt='背景画像' />
        <div className='absolute top-[2%] left-[1%]'>
          <h1 className='bg-[#FCF2D3] rounded-[30px] py-[6px] px-[15px] inline-block text-[67px]'>
            {user.name}
          </h1>
          <p
            className={`py-[3px] px-[12px] inline-block text-[27px] rounded-[17px] ${user.isMan ? 'bg-[#0A84FF] text-white' : 'bg-[#e83e8c] text-white'}`}
          >
            {user.isMan ? '男性' : '女性'}
          </p>
          <p className='py-[5px] px-[15px] inline-block text-[31px] rounded-[17px] bg-p-light'>
            {calcAge(user.birthday)}歳
          </p>
        </div>
        {artName && (
          <div className='absolute top-0 right-[0.7%] text-[51px]'>
            <span className='badge badge-primary'>{artName}</span>
          </div>
        )}
        <div className='absolute top-[27%] left-[39%]'>
          <img
            src={user.avatarPath}
            className='card-img-top rounded-circle'
            width='100%'
            height='100%'
            alt='アバター画像'
          />
        </div>
      </div>

      <div className='w-full h-[50px] bg-p-brand' />

      {/* 紹介文 */}
      <div className='card mx-auto w-[93%] bg-[#FCF2D3] rounded-[11px] mb-[5%] text-[27px] border-none mt-[5%]'>
        <h3 className='card-header text-white bg-p-brand text-[25px] [border-radius:11px_11px_0_0] pt-[25px] pr-0 pb-[11px] pl-[21px]'>
          紹介文
        </h3>
        <div className='card-body pt-[1%] pr-0 pb-[1%] pl-[1%]'>
          <p className='card-text text-[39px] leading-[9vh]' style={{ whiteSpace: 'pre-wrap' }}>
            {user.profile}
          </p>
        </div>
      </div>

      {/* スカウトボタン（職人ログイン時のみ） */}
      {loggedIn && isCreator && (
        <div className='w-[50%] fixed bottom-0 left-[25%]'>
          <button
            type='button'
            className='btn btn-lg w-full bg-[#FFA30D] text-[33px] hover:opacity-90'
            onClick={handleScout}
            disabled={isScouted}
          >
            {isScouted ? 'スカウト済み' : 'スカウト'}
          </button>
        </div>
      )}
    </div>
  );
};
