'use client';

// web/app/my_page/my_page/page.tsx
//
// マイページ（自分のプロフィール）。Rails の MyPageController#my_page を置き換える。
// 中身は GET /api/v1/profile（Rails 版も同じ ProfileSerializer）。

import { FlashMessages } from '@sucseed/ui';
import { useRequireLogin } from '../../../lib/session';
import { useCurrentUser } from '../../../lib/users';
import { ProfileMenu } from '../../_components/ProfileMenu';
import { ProfileField } from '../_components/ProfileField';

export default function MyPage() {
  const loggedIn = useRequireLogin() !== null;
  const user = useCurrentUser(loggedIn);

  if (!loggedIn || user === undefined) {
    return null;
  }

  if (user === null) {
    return <FlashMessages flash={{ danger: 'エラーが発生しました' }} />;
  }

  // "YYYY-MM-DD" をタイムゾーンに左右されずに年月日へ分ける
  const [year, month, day] = user.birthday.split('-').map(Number);

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">プロフィール</h1>

      <div className="min-h-screen">
        <div className="w-[93%] mx-auto bg-p-light border border-p-mid rounded-[7px] mb-[5%]">
          <ProfileMenu isCreator={user.role === 'creator'} className="text-right mb-5" />

          {!user.detailRegistered && (
            <div className="px-4 py-3 rounded mb-2 text-xl bg-yellow-100 border border-yellow-400 text-yellow-800">
              ユーザーの詳細情報登録お願いします。
            </div>
          )}

          <ProfileField title="アバター" centered>
            {/* biome-ignore lint/performance/noImgElement: アップロード画像は Rails から中継して配るので next/image を通さない */}
            <img
              src={user.avatarPath}
              className="rounded-full"
              width={300}
              height={300}
              alt="アバター画像"
            />
          </ProfileField>
          <ProfileField title="ユーザー名" centered>
            <p>{user.name}</p>
          </ProfileField>
          <ProfileField title="性別" centered>
            <p>{user.isMan ? '男性' : '女性'}</p>
          </ProfileField>
          <ProfileField title="メールアドレス" centered>
            <p>{user.email}</p>
          </ProfileField>
          <ProfileField title="生年月日" centered>
            <p>
              {year}年{month}月{day}日
            </p>
          </ProfileField>
          <ProfileField title="紹介文">
            <p style={{ whiteSpace: 'pre-wrap' }}>{user.profile}</p>
          </ProfileField>

          <div className="mb-[3%]" />
        </div>
      </div>
    </>
  );
}
