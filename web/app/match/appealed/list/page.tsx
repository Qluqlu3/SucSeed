'use client';

// web/app/match/appealed/list/page.tsx
//
// 職人: 自分宛てで未回答のアピール。Rails の MatchController#appealed_list_view を置き換える。
// 「話してみる」「ごめんなさい」は PATCH /api/v1/appeals/:heirId で回答する。

import { api } from '@sucseed/api';
import { isCreator } from '../../../../lib/session';
import { AnswerList } from '../../_components/AnswerList';

export default function AppealedListPage() {
  return (
    <AnswerList
      heading="アピールリスト"
      allowed={isCreator}
      fetchPage={api.appeals.index}
      answer={api.appeals.answer}
    />
  );
}
