'use client';

// web/app/match/matching/list/page.tsx
//
// マッチング一覧（成立したアピール/スカウト）。Rails の MatchController#matching_list_view を
// 置き換える最初の移行画面。データは GET /api/v1/matches から取る。
//
// Rails 側の画面（frontend/components/MatchingPage）は、本番の構成（段階 0-4）が決まって
// Next が配信されるまで残す。開発時は Next のこのページが優先され、Rails 側には届かない。

import { api, type Match } from '@sucseed/api';
import { FlashMessages, MatchUserList, pushFlash, type Role } from '@sucseed/ui';
import { useState } from 'react';
import {
  isAuthError,
  partnerProfilePath,
  toPartnerCard,
  useAllMatches,
} from '../../../../lib/matches';
import { redirectToLogin, useRequireLogin } from '../../../../lib/session';

const toMatchUser = (match: Match, role: Role) => ({
  ...toPartnerCard(match, role),
  isAddList: match.isAddList,
  profilePath: partnerProfilePath(match, role),
});

// メッセージ相手に追加して、メッセージ一覧（まだ Rails の画面）へ移る
const MessageButton = ({ userId }: { userId: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToMessageList = async () => {
    setSubmitting(true);
    setError(null);
    const result = await api.messageThreads.create(userId);
    if (!result.ok) {
      if (isAuthError(result.error)) {
        redirectToLogin();
        return;
      }
      setError(result.error.message);
      setSubmitting(false);
      return;
    }
    // Rails の MessageController#message_list_add と同じく、追加済みだったときだけ知らせる
    if (result.data.alreadyExists) {
      pushFlash('information', '追加済み');
    }
    window.location.assign('/message/list');
  };

  return (
    <>
      {error && <FlashMessages flash={{ danger: error }} />}
      <button
        type="button"
        className="w-full m-0 py-[1%] text-[30px] bg-green-600 text-white rounded hover:opacity-80"
        disabled={submitting}
        onClick={addToMessageList}
      >
        メッセージ
      </button>
    </>
  );
};

export default function MatchingListPage() {
  const session = useRequireLogin();
  const role = session?.role;
  const { matches, error } = useAllMatches(role, api.matches.index);

  // 取得中は見出しも出さない（Rails の画面はサーバー側で描画済みだったので、空の状態を見せない）
  if (!role || (matches === null && error === null)) {
    return null;
  }

  return (
    <MatchUserList
      heading="マッチングリスト"
      users={(matches ?? []).map((match) => toMatchUser(match, role))}
      flash={error ? { danger: error } : {}}
      profilePath={(user) => user.profilePath}
      renderActions={(user) => !user.isAddList && <MessageButton userId={user.pageId} />}
    />
  );
}
