'use client';

// web/app/match/appeal/list_check/page.tsx
//
// 後継者: 自分が送って未回答のアピール。Rails の MatchController#appeal_check を置き換える。
//
// GET /api/v1/appeals は後継者には回答済みも返すが、Rails の画面は未回答だけを出していたので
// ここで絞る（回答済みのものはマッチング一覧・相手の画面で分かる）。

import { api } from '@sucseed/api';
import { MatchUserList } from '@sucseed/ui';
import { partnerProfilePath, toPartnerCard, useAllMatches } from '../../../../lib/matches';
import { isNonCreator, useRequireRole } from '../../../../lib/session';

const AppealedBadge = () => (
  <div className="flex">
    <div className="w-full">
      <p className="w-full m-0 py-[1%] text-[30px] bg-p-brand text-white text-center rounded cursor-default">
        アピール済
      </p>
    </div>
  </div>
);

export default function AppealCheckPage() {
  const session = useRequireRole(isNonCreator);
  const role = session?.role;
  const { matches, error } = useAllMatches(role, api.appeals.index);

  if (!role || (matches === null && error === null)) {
    return null;
  }

  const users = (matches ?? [])
    .filter((match) => match.isOk === null)
    .map((match) => ({
      ...toPartnerCard(match, role),
      title: match.creatorTitle ?? '',
      profilePath: partnerProfilePath(match, role),
    }));

  return (
    <MatchUserList
      heading="アピール確認"
      users={users}
      flash={error ? { danger: error } : {}}
      profilePath={(user) => user.profilePath}
      renderActions={() => <AppealedBadge />}
    />
  );
}
