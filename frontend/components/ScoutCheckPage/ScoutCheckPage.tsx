// frontend/components/ScoutCheckPage/ScoutCheckPage.tsx
//
// /match/scout/check ページの React コンポーネント。
// 後継者がスカウトされた職人リストを表示し、OK/NGを送信する。
//
// 【data-props に含まれるデータ】
//   scouts : [{ pageId, name, birthday, avatarPath, matchTime, title }]
import { AnswerButtons, type MatchListUser, MatchUserList } from '../MatchUserList';

interface ScoutUser extends MatchListUser {
  title: string;
}

interface Props {
  scouts: ScoutUser[];
  flash: Record<string, string>;
}

export const ScoutCheckPage = ({ scouts, flash }: Props) => (
  <MatchUserList
    heading="スカウト確認"
    users={scouts}
    flash={flash}
    profilePath={(scout) => `/page/creator/${scout.pageId}`}
    renderActions={(scout) => (
      <AnswerButtons
        okAction={`/scout/ok/${scout.pageId}`}
        sorryAction={`/scout/sorry/${scout.pageId}`}
      />
    )}
  />
);
