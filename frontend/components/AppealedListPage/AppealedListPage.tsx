// frontend/components/AppealedListPage/AppealedListPage.tsx
//
// /match/appealed/list ページの React コンポーネント。
// 職人がアピールされた後継者リストを表示し、OK/NGを送信する。
//
// 【data-props に含まれるデータ】
//   matches : [{ pageId, name, birthday, avatarPath, matchTime }]
import { AnswerButtons, type MatchListUser, MatchUserList } from '../MatchUserList';

interface Props {
  matches: MatchListUser[];
  flash: Record<string, string>;
}

export const AppealedListPage = ({ matches, flash }: Props) => (
  <MatchUserList
    heading="アピールリスト"
    users={matches}
    flash={flash}
    profilePath={(match) => `/page/heir/${match.pageId}`}
    renderActions={(match) => (
      <AnswerButtons
        okAction={`/match/ok/${match.pageId}`}
        sorryAction={`/match/sorry/${match.pageId}`}
      />
    )}
  />
);
