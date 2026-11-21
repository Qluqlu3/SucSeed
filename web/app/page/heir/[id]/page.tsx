'use client';

// web/app/page/heir/[id]/page.tsx
//
// 後継者ページ（未ログインでも見られる）。Rails の YourPageController#heir_show を置き換える。
// 中身は GET /api/v1/heirs/:id（詳細プロフィール未登録の後継者も返る）、スカウトは POST /api/v1/scouts。
// 存在しない人・職人の :id は 404 の画面（Rails は職人の :id でもこの画面を出していた）。

import { api } from '@sucseed/api';
import { FlashMessages } from '@sucseed/ui';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { useResource } from '../../../../lib/resource';
import { isAuthError, redirectToLogin, useSession } from '../../../../lib/session';
import { FixedActionButton, ProfileHero, ProfileSection } from '../../_components/ProfileHero';

export default function HeirPage() {
  const { id } = useParams<{ id: string }>();
  const session = useSession();
  const state = useResource(id, api.heirs.show);
  // 押す前は取得した値、送った後は true
  const [scouted, setScouted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (state.status === 'not_found') {
    notFound();
  }

  if (state.status === 'error') {
    return <FlashMessages flash={{ danger: state.message }} />;
  }

  if (state.status === 'loading' || session === null) {
    return null;
  }

  const heir = state.data;

  const scout = async () => {
    setErrorMessage(null);
    const result = await api.scouts.create(heir.userId);
    if (result.ok) {
      setScouted(true);
    } else if (isAuthError(result.error)) {
      redirectToLogin();
    } else {
      setErrorMessage(result.error.message);
    }
  };

  return (
    <div className="min-h-screen">
      <FlashMessages flash={errorMessage ? { danger: errorMessage } : {}} />

      <ProfileHero
        user={heir.user}
        height="800px"
        badge={
          heir.artCategoryName && (
            <span className="inline-block rounded bg-p-brand px-2 py-1 text-sm text-white">
              {heir.artCategoryName}
            </span>
          )
        }
      />

      <div className="w-full h-[50px] bg-p-brand" />

      <ProfileSection title="紹介文" className="mt-[5%]">
        <p className="text-[39px] leading-[9vh]" style={{ whiteSpace: 'pre-wrap' }}>
          {heir.user.profile}
        </p>
      </ProfileSection>

      {/* スカウトは職人だけ */}
      {session.role === 'creator' && (
        <FixedActionButton
          label="スカウト"
          doneLabel="スカウト済み"
          done={scouted || heir.isScouted}
          onClick={scout}
        />
      )}
    </div>
  );
}
