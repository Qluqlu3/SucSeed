// frontend/components/ScoutShowPage/ScoutShowPage.tsx
//
// match/scout_show テンプレートの React コンポーネント（スカウト一覧）。
// 職人が自分の送ったスカウトとその回答状況を確認する画面。
// 回答するのは後継者側（ScoutCheckPage）なので、ここには OK/NG ボタンを置かない。
//
// 【data-props】
//   scouts: [{ pageId, name, birthday, avatarPath, matchTime, isOk }]
//   pageId は後継者の user id

import { type MatchListUser, MatchUserList } from '../MatchUserList';

interface ScoutUser extends MatchListUser {
  // null = 未回答 / true = 承諾 / false = お断り
  isOk: boolean | null;
}

interface Props {
  scouts: ScoutUser[];
  flash: Record<string, string>;
}

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

export const ScoutShowPage = ({ scouts, flash }: Props) => (
  <MatchUserList
    heading="スカウト一覧"
    users={scouts}
    flash={flash}
    profilePath={(scout) => `/page/heir/${scout.pageId}`}
    renderActions={(scout) => <ScoutStatus isOk={scout.isOk} />}
  />
);
