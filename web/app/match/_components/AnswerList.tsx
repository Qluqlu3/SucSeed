'use client';

// web/app/match/_components/AnswerList.tsx
//
// 受け取ったアピール/スカウトに回答する一覧（職人のアピールリスト・後継者のスカウト確認）。
// Rails の MatchController#appealed_list_view / scouted_show と、回答の
// appeal_answer_* / scout_answer_* を API（PATCH /api/v1/appeals/:id・scouts/:id）で置き換える。
//
// Rails は回答後に同じ画面へリダイレクトして flash を出し、回答した行は未回答でなくなるので消える。
// ここでは画面を読み直さず、回答した行を一覧から外して見出しの下にメッセージを出す。

import type { ApiResult, Collection, Id, Match, PageParams } from '@sucseed/api';
import {
  AnswerButtons,
  type Flash,
  type MatchListUser,
  MatchUserList,
  type Role,
} from '@sucseed/ui';
import { useState } from 'react';
import { partnerProfilePath, toPartnerCard, useAllMatches } from '../../../lib/matches';
import { isAuthError, redirectToLogin, useRequireRole } from '../../../lib/session';

interface Props {
  heading: string;
  allowed: (role: Role) => boolean;
  fetchPage: (params: PageParams) => Promise<ApiResult<Collection<Match>>>;
  /** partnerId は回答する相手（アピールなら後継者、スカウトなら職人）の user id */
  answer: (partnerId: Id, accepted: boolean) => Promise<ApiResult<Match>>;
  /** 職人の屋号を出すか（相手が職人の一覧だけ） */
  withTitle?: boolean;
}

// Rails の flash（t('flash.success.saved') / t('flash.danger.error')）と同じ文言
const SAVED = '保存しました';
const FAILED = 'エラーが発生しました';

export const AnswerList = ({ heading, allowed, fetchPage, answer, withTitle = false }: Props) => {
  const session = useRequireRole(allowed);
  const role = session?.role;
  const { matches, setMatches, error } = useAllMatches(role, fetchPage);
  const [flash, setFlash] = useState<Flash>({});
  const [answering, setAnswering] = useState<Id | null>(null);

  if (!role || (matches === null && error === null)) {
    return null;
  }

  const onAnswer = async (partnerId: Id, accepted: boolean) => {
    setAnswering(partnerId);
    const result = await answer(partnerId, accepted);
    setAnswering(null);
    if (!result.ok) {
      if (isAuthError(result.error)) {
        redirectToLogin();
        return;
      }
      setFlash({ danger: FAILED });
      return;
    }
    setMatches(
      (current) =>
        current?.filter((match) => toPartnerCard(match, role).pageId !== partnerId) ?? null,
    );
    setFlash({ success: SAVED });
  };

  const users = (matches ?? []).map((match) => {
    const card: MatchListUser & { profilePath: string } = {
      ...toPartnerCard(match, role),
      profilePath: partnerProfilePath(match, role),
    };
    return withTitle ? { ...card, title: match.creatorTitle ?? '' } : card;
  });

  return (
    <MatchUserList
      heading={heading}
      users={users}
      flash={error ? { danger: error } : flash}
      profilePath={(user) => user.profilePath}
      renderActions={(user) => (
        <AnswerButtons
          disabled={answering !== null}
          onAnswer={(accepted) => void onAnswer(user.pageId, accepted)}
        />
      )}
    />
  );
};
