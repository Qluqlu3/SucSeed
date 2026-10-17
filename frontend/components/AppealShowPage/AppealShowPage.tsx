// frontend/components/AppealShowPage/AppealShowPage.tsx
//
// /match/appeal/list_check ページの React コンポーネント。
// 後継者がアピールした職人一覧を表示する。
//
// 【data-props に含まれるデータ】
//   appeals : [{ pageId, name, birthday, avatarPath, title, matchTime, isOk }]

import { getCsrfToken } from '../../utils/csrf';
import { MatchUserList } from '../MatchUserList';

// ── 型定義 ──────────────────────────────────────────────────────────
interface AppealUser {
  pageId: string;
  name: string;
  birthday: string;
  avatarPath: string;
  title: string;
  matchTime: string;
  // is_ok: null=未回答, true=OK, false=NG
  isOk: boolean | null;
}

interface Props {
  appeals: AppealUser[];
  flash: Record<string, string>;
}

// ── コンポーネント ───────────────────────────────────────────────────

const AppealActions = ({ appeal }: { appeal: AppealUser }) => (
  <div className="flex">
    {appeal.isOk ? (
      <div className="w-full">
        <form action={`/message/add/${appeal.pageId}`} method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <button
            type="submit"
            className="p-0 bg-transparent border-none cursor-pointer text-p-brand hover:underline"
          >
            <p>メッセージ</p>
          </button>
        </form>
      </div>
    ) : (
      <div className="w-full">
        <p className="w-full m-0 py-[1%] text-[30px] bg-p-brand text-white text-center rounded cursor-default">
          アピール済
        </p>
      </div>
    )}
  </div>
);

export const AppealShowPage = ({ appeals, flash }: Props) => (
  <MatchUserList
    heading="アピール確認"
    users={appeals}
    flash={flash}
    profilePath={(appeal) => `/page/creator/${appeal.pageId}`}
    renderActions={(appeal) => <AppealActions appeal={appeal} />}
  />
);
