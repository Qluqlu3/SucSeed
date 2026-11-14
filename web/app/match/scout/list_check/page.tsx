'use client';

// web/app/match/scout/list_check/page.tsx
//
// 職人: 自分が送ったスカウトと回答状況（回答済みも含む）。Rails の MatchController#scout_check を
// 置き換える。回答するのは後継者側（/match/scouted/list）なので、ここにはボタンを置かない。

import { api } from '@sucseed/api';
import { MatchUserList } from '@sucseed/ui';
import { partnerProfilePath, toPartnerCard, useAllMatches } from '../../../../lib/matches';
import { isCreator, useRequireRole } from '../../../../lib/session';

const SCOUT_STATUS = {
  pending: { label: '返事待ち', className: 'bg-p-brand' },
  accepted: { label: 'マッチング成立', className: 'bg-green-600' },
  declined: { label: 'お断りされました', className: 'bg-gray-500' },
} as const;

const ScoutStatus = ({ isOk }: { isOk: boolean | null }) => {
  const status = SCOUT_STATUS[isOk === null ? 'pending' : isOk ? 'accepted' : 'declined'];
  return (
    <p
      className={`w-full m-0 py-[1%] text-[30px] text-white text-center rounded cursor-default ${status.className}`}
    >
      {status.label}
    </p>
  );
};

export default function ScoutListCheckPage() {
  const session = useRequireRole(isCreator);
  const role = session?.role;
  const { matches, error } = useAllMatches(role, api.scouts.index);

  if (!role || (matches === null && error === null)) {
    return null;
  }

  const users = (matches ?? []).map((match) => ({
    ...toPartnerCard(match, role),
    isOk: match.isOk,
    profilePath: partnerProfilePath(match, role),
  }));

  return (
    <MatchUserList
      heading="スカウト一覧"
      users={users}
      flash={error ? { danger: error } : {}}
      profilePath={(user) => user.profilePath}
      renderActions={(user) => <ScoutStatus isOk={user.isOk} />}
    />
  );
}
