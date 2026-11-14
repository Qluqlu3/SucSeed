'use client';

// web/app/diary/view/page.tsx
//
// 自分 + お気に入りの相手の日記。Rails の DiaryController#select_diary を置き換える。
// データは GET /api/v1/diaries（user_id 無し）。

import { FlashMessages } from '@sucseed/ui';
import { useAllDiaries, useCurrentUser } from '../../../lib/diaries';
import { useRequireLogin } from '../../../lib/session';
import { DiaryCards } from '../_components/DiaryCards';

export default function DiaryViewPage() {
  const loggedIn = useRequireLogin() !== null;
  const currentUser = useCurrentUser(loggedIn);
  const { diaries, error } = useAllDiaries(loggedIn);

  if (!loggedIn || currentUser === undefined || (diaries === null && error === null)) {
    return null;
  }

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">日記</h1>

      <FlashMessages flash={error ? { danger: error } : {}} />

      <div className="pt-[23px] w-full min-h-[110vh] mx-auto">
        <div className="flex flex-wrap w-full !mx-0 pl-[1%]">
          <div className="w-full md:w-9/12 bg-p-dark border border-p-brand rounded-[7px] pl-[1%] pb-[5%]">
            <DiaryCards diaries={diaries ?? []} currentUser={currentUser} />
          </div>
        </div>
      </div>
    </>
  );
}
