'use client';

// web/app/diary/heir/favorite/page.tsx
//
// 自分 + お気に入りの相手の日記（後継者のメニューから開く版）。Rails の
// DiaryController#heir_favorite_diary を置き換える。中身は /diary/view と同じで、枠の幅だけ違う。
// Rails と同じくログインだけを求め、ロールは見ない。

import { FlashMessages } from '@sucseed/ui';
import { useAllDiaries } from '../../../../lib/diaries';
import { useRequireLogin } from '../../../../lib/session';
import { useCurrentUser } from '../../../../lib/users';
import { DiaryCards } from '../../_components/DiaryCards';

export default function HeirFavoriteDiaryPage() {
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
        <div className="flex flex-wrap w-full !mx-0 pl-[1%] pr-[1%]">
          <div className="w-full bg-p-dark border border-p-brand rounded-[7px] pl-[1%] pb-[5%] min-h-[55vh]">
            <DiaryCards diaries={diaries ?? []} currentUser={currentUser} />
          </div>
        </div>
      </div>
    </>
  );
}
