'use client';

// web/app/diary/show/[id]/page.tsx
//
// :id の人の日記（未ログインでも見られる）。Rails の DiaryController#your_diary を置き換える。
// 見出しの名前と職人ページへのタブの有無は GET /api/v1/users/:id、
// 日記は GET /api/v1/diaries?user_id=:id。いいね・コメントはログインが要る（DiaryCard が扱う）。
// ユーザーが存在しなければ Rails と同じく 404 の画面を出す。

import { CreatorProfileTabs, FlashMessages } from '@sucseed/ui';
import { notFound, useParams } from 'next/navigation';
import { useAllDiaries } from '../../../../lib/diaries';
import { useSession } from '../../../../lib/session';
import { useCurrentUser, usePublicUser } from '../../../../lib/users';
import { DiaryCards } from '../../_components/DiaryCards';

export default function YourDiaryPage() {
  const { id } = useParams<{ id: string }>();
  const sessionLoaded = useSession() !== null;
  const currentUser = useCurrentUser(sessionLoaded);
  const owner = usePublicUser(id);
  const { diaries, error } = useAllDiaries(owner.status === 'loaded', id);

  if (owner.status === 'not_found') {
    notFound();
  }

  if (owner.status === 'error') {
    return <FlashMessages flash={{ danger: owner.message }} />;
  }

  if (
    owner.status === 'loading' ||
    currentUser === undefined ||
    (diaries === null && error === null)
  ) {
    return null;
  }

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
        {owner.data.name}さんの日記
      </h1>

      {owner.data.hasCreatorProfile && <CreatorProfileTabs targetUserId={id} active="diary" />}

      <FlashMessages flash={error ? { danger: error } : {}} />

      <div className="pt-[23px] w-full min-h-[110vh] mx-auto">
        <div className="flex flex-wrap w-full !mx-0 px-[1%]">
          <div className="w-full bg-p-dark border border-p-brand rounded-[7px] px-[1%] pb-[5%]">
            <DiaryCards diaries={diaries ?? []} currentUser={currentUser} />
          </div>
        </div>
      </div>
    </>
  );
}
