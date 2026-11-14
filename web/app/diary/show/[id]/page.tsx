'use client';

// web/app/diary/show/[id]/page.tsx
//
// :id の人の日記（未ログインでも見られる）。Rails の DiaryController#your_diary を置き換える。
// 見出しの名前と職人ページへのタブの有無は GET /api/v1/users/:id、
// 日記は GET /api/v1/diaries?user_id=:id。いいね・コメントはログインが要る（DiaryCard が扱う）。
// ユーザーが存在しなければ Rails と同じく 404 の画面を出す。

import { api, type PublicUserPage } from '@sucseed/api';
import { CreatorProfileTabs, FlashMessages } from '@sucseed/ui';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAllDiaries, useCurrentUser } from '../../../../lib/diaries';
import { useSession } from '../../../../lib/session';
import { DiaryCards } from '../../_components/DiaryCards';

type OwnerState =
  | { status: 'loading' }
  | { status: 'loaded'; owner: PublicUserPage }
  | { status: 'not_found' }
  | { status: 'error'; message: string };

export default function YourDiaryPage() {
  const { id } = useParams<{ id: string }>();
  const sessionLoaded = useSession() !== null;
  const currentUser = useCurrentUser(sessionLoaded);
  const [owner, setOwner] = useState<OwnerState>({ status: 'loading' });
  const { diaries, error } = useAllDiaries(owner.status === 'loaded', id);

  useEffect(() => {
    let active = true;
    setOwner({ status: 'loading' });
    void api.users.show(id).then((result) => {
      if (!active) {
        return;
      }
      if (result.ok) {
        setOwner({ status: 'loaded', owner: result.data });
      } else if (result.error.code === 'not_found') {
        setOwner({ status: 'not_found' });
      } else {
        setOwner({ status: 'error', message: result.error.message });
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

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
        {owner.owner.name}さんの日記
      </h1>

      {owner.owner.hasCreatorProfile && <CreatorProfileTabs targetUserId={id} active="diary" />}

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
