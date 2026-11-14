'use client';

// web/app/match/scouted/list/page.tsx
//
// 後継者: 自分宛てで未回答のスカウト。Rails の MatchController#scouted_show を置き換える。
// 「話してみる」「ごめんなさい」は PATCH /api/v1/scouts/:creatorId で回答する。

import { api } from '@sucseed/api';
import { isNonCreator } from '../../../../lib/session';
import { AnswerList } from '../../_components/AnswerList';

export default function ScoutedListPage() {
  return (
    <AnswerList
      heading="スカウト確認"
      allowed={isNonCreator}
      fetchPage={api.scouts.index}
      answer={api.scouts.answer}
      withTitle
    />
  );
}
