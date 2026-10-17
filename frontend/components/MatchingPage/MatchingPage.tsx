// frontend/components/MatchingPage/MatchingPage.tsx
//
// /match/matching/list ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   matches : マッチング済みユーザー一覧
//             [{ pageId, name, birthday, avatarPath, matchTime, isAddList, profilePath }]

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';
import { type MatchListUser, MatchUserList } from '../MatchUserList';

// ── 型定義 ──────────────────────────────────────────────────────────
interface MatchUser extends MatchListUser {
  // is_add_list: 0 = 未追加、1 = 追加済み
  isAddList: number;
  // 相手のプロフィールページ。閲覧者が職人なら後継者ページ、後継者なら職人ページになる
  profilePath: string;
}

interface Props {
  matches: MatchUser[];
  flash: Record<string, string>;
}

// ── コンポーネント ───────────────────────────────────────────────────

const MessageForm = ({ userId }: { userId: string }) => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form action={`/message/add/${userId}`} method="post" onSubmit={() => setSubmitted(true)}>
      <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
      <button
        type="submit"
        className="w-full m-0 py-[1%] text-[30px] bg-green-600 text-white rounded hover:opacity-80"
        disabled={submitted}
      >
        メッセージ
      </button>
    </form>
  );
};

export const MatchingPage = ({ matches, flash }: Props) => (
  <MatchUserList
    heading="マッチングリスト"
    users={matches}
    flash={flash}
    profilePath={(match) => match.profilePath}
    renderActions={(match) => match.isAddList === 0 && <MessageForm userId={match.pageId} />}
  />
);
