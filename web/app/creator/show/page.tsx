'use client';

// web/app/creator/show/page.tsx
//
// 自分の職人の詳細プロフィール（職人のみ）。Rails の CreatorController#show を置き換える。
// GET /api/v1/profile/creator が not_found なら（未登録）Rails と同じくこの画面で登録フォームを出す。

import { api } from '@sucseed/api';
import { FlashMessages } from '@sucseed/ui';
import type { ReactNode } from 'react';
import { useResource } from '../../../lib/resource';
import { isCreator, useRequireRole } from '../../../lib/session';
import { ProfileMenu } from '../../_components/ProfileMenu';
import { CreatorCreateForm } from '../_components/CreatorCreateForm';

const loadOwnCreator = () => api.profile.creator.show();

const Item = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg">
    <div className="pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand">{title}</div>
    <div className="text-[27px] py-[2%] bg-white text-center">{children}</div>
  </div>
);

export default function CreatorShowPage() {
  const session = useRequireRole(isCreator);
  const state = useResource('me', loadOwnCreator, session !== null);

  if (!session || state.status === 'loading') {
    return null;
  }

  if (state.status === 'error') {
    return <FlashMessages flash={{ danger: state.message }} />;
  }

  if (state.status === 'not_found') {
    return <CreatorCreateForm artCategories={session.artCategories} />;
  }

  const creator = state.data;

  return (
    <div>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">制作者情報</h1>

      <div className="min-h-screen">
        <div className="w-[85%] mx-auto mb-[5%] bg-p-light border border-p-mid rounded-[7px]">
          <ProfileMenu isCreator />

          <Item title="工芸名">{creator.title}</Item>
          <Item title="工芸カテゴリー">{creator.artCategoryName}</Item>
          <Item title="創業年数">{creator.establishment}年</Item>
          <Item title="従業員数">{creator.employee}人</Item>
          <Item title="作業所郵便番号">{creator.postalCode}</Item>
          <Item title="募集チェック">
            <p>{creator.isRecruitment ? '募集中' : '募集停止中'}</p>
          </Item>

          <div className="pb-[5%] mb-[7%]" />
        </div>
      </div>
    </div>
  );
}
