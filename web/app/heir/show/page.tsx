'use client';

// web/app/heir/show/page.tsx
//
// 自分の後継者の詳細プロフィール（職人以外）。Rails の HeirController#heir_show を置き換える。
// GET /api/v1/profile/heir が not_found なら（未登録）Rails と同じくこの画面で登録フォームを出す。
// Rails は職人でも開けて登録までできたが、ここでは他の後継者向けの画面と同じく職人はトップへ移す。

import { api } from '@sucseed/api';
import { FlashMessages } from '@sucseed/ui';
import { useResource } from '../../../lib/resource';
import { isNonCreator, useRequireRole } from '../../../lib/session';
import { HeirForm } from '../_components/HeirForm';
import { HeirBox, HeirFrame } from '../_components/HeirFrame';

const loadOwnHeir = () => api.profile.heir.show();

export default function HeirShowPage() {
  const session = useRequireRole(isNonCreator);
  const state = useResource('me', loadOwnHeir, session !== null);

  if (!session || state.status === 'loading') {
    return null;
  }

  if (state.status === 'error') {
    return <FlashMessages flash={{ danger: state.message }} />;
  }

  if (state.status === 'not_found') {
    return <HeirForm heir={null} artCategories={session.artCategories} />;
  }

  return (
    <HeirFrame title="後継者情報参照">
      <div className="w-[80%] h-screen mt-[7%] mx-auto">
        <HeirBox title="興味のある分野">
          <p className="text-[19px]">{state.data.artCategoryName}</p>
        </HeirBox>
        <HeirBox title="自己紹介">
          <p className="text-[19px]">{state.data.introduction}</p>
        </HeirBox>
      </div>
    </HeirFrame>
  );
}
