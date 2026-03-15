// frontend/components/HeirPage/HeirPage.tsx
//
// /page/heir/:id ページの React コンポーネント（後継者ページ）。
// スカウト送信は fetch API で Rails に送信する。

import { useState } from 'react';

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

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
}

export const HeirPage = ({
  user,
  artName,
  isScouted: initialScouted,
  loggedIn,
  isCreator,
  targetUserId,
}: Props) => {
  const [isScouted, setIsScouted] = useState(initialScouted);

  const handleScout = async () => {
    await fetch(`/scout/send/${targetUserId}`, {
      method: 'POST',
      headers: { 'X-CSRF-Token': getCsrfToken() },
    });
    setIsScouted(true);
  };

  return (
    <div className='all-cover-box'>
      {/* プロフィールヘッダー */}
      <div className='background-img-box'>
        <img src='/assets/main1.jpg' height='800px' width='100%' alt='背景画像' />
        <div className='name-age-box'>
          <h1 className='h1-box'>{user.name}</h1>
          <p className={`sex-box ${user.isMan ? 'is_man' : 'is_woman'}`}>
            {user.isMan ? '男性' : '女性'}
          </p>
          <p className='age-box'>{calcAge(user.birthday)}歳</p>
        </div>
        {artName && (
          <div className='label-box'>
            <span className='badge badge-primary'>{artName}</span>
          </div>
        )}
        <div className='profile-avatar'>
          <img
            src={user.avatarPath}
            className='card-img-top rounded-circle'
            width='100%'
            height='100%'
            alt='アバター画像'
          />
        </div>
      </div>

      <div className='bar-box' />

      {/* 紹介文 */}
      <div className='card my-card-pro heir-profile-box'>
        <h3 className='card-header my-card-header-pro'>紹介文</h3>
        <div className='card-body card-body-intro'>
          <p className='card-text' style={{ whiteSpace: 'pre-wrap' }}>
            {user.profile}
          </p>
        </div>
      </div>

      {/* スカウトボタン（職人ログイン時のみ） */}
      {loggedIn && isCreator && (
        <div className='appeal-box'>
          <button
            type='button'
            className='btn btn-lg appeal-btn'
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
