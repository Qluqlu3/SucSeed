'use client';

// web/app/heir/edit/page.tsx
//
// 後継者の詳細プロフィールの変更（職人以外）。Rails の HeirController#heir_edit / heir_update を置き換える。
// 今の値は GET /api/v1/profile/heir、変更は PATCH /api/v1/profile/heir。
// 未登録なら Rails と同じく /heir/show（登録フォーム）へ移す。

import { api } from '@sucseed/api';
import { FlashMessages } from '@sucseed/ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useResource } from '../../../lib/resource';
import { isNonCreator, useRequireRole } from '../../../lib/session';
import { HeirForm } from '../_components/HeirForm';

const loadOwnHeir = () => api.profile.heir.show();

export default function HeirEditPage() {
  const session = useRequireRole(isNonCreator);
  const state = useResource('me', loadOwnHeir, session !== null);
  const router = useRouter();
  const notRegistered = state.status === 'not_found';

  useEffect(() => {
    if (notRegistered) {
      router.replace('/heir/show');
    }
  }, [notRegistered, router]);

  if (!session || state.status === 'loading' || state.status === 'not_found') {
    return null;
  }

  if (state.status === 'error') {
    return <FlashMessages flash={{ danger: state.message }} />;
  }

  return <HeirForm heir={state.data} artCategories={session.artCategories} />;
}
