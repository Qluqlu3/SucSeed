// frontend/components/MatchUserList/MatchUserList.tsx
//
// アピール/スカウト/マッチングの一覧ページで共通の枠。
// 見出し・空状態・相手ユーザーのカードを描画し、
// カードのリンク先と下部のボタン類だけを各ページから受け取る。

import type { ReactNode } from 'react';
import { getCsrfToken } from '../../utils/csrf';
import { calcAge, timeAgo } from '../../utils/date';
import { FlashMessages } from '../FlashMessages';

export interface MatchListUser {
  pageId: string;
  name: string;
  birthday: string;
  avatarPath: string;
  matchTime: string;
  // 職人の肩書き。相手が職人の一覧でだけ渡される
  title?: string;
}

interface Props<T extends MatchListUser> {
  heading: string;
  users: T[];
  flash: Record<string, string>;
  profilePath: (user: T) => string;
  renderActions: (user: T) => ReactNode;
}

export const MatchUserList = <T extends MatchListUser>({
  heading,
  users,
  flash,
  profilePath,
  renderActions,
}: Props<T>) => (
  <div>
    <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">{heading}</h1>

    <FlashMessages flash={flash} />

    <div className="min-h-screen">
      <div className="w-[93%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]">
        {users.length === 0 ? (
          <p className="mb-[60vh] text-[39px] text-p-dark">まだありません</p>
        ) : (
          users.map((user) => (
            <div key={user.pageId} className="mb-[1%] rounded-lg border border-p-mid">
              <div className="px-4 py-2 bg-[#BAA9DA] rounded-t-lg">
                {user.matchTime}&nbsp;{timeAgo(user.matchTime)}前
              </div>
              <a href={profilePath(user)}>
                <div className="p-4 bg-white">
                  <div className="flex flex-wrap">
                    <div className="w-5/12 text-center">
                      <img
                        src={user.avatarPath}
                        className="rounded-full"
                        width={230}
                        height={230}
                        alt={user.name}
                      />
                    </div>
                    <div className="w-7/12 text-left">
                      <p className="text-[61px] p-0 m-0">{user.name}</p>
                      <p className="text-[35px] p-0 my-[1%] ml-[71px]">
                        {calcAge(user.birthday)}
                        <small>歳</small>
                      </p>
                      {user.title !== undefined && (
                        <p className="text-[47px] p-0 m-0">{user.title}</p>
                      )}
                    </div>
                  </div>
                </div>
              </a>
              <div className="pt-[0.2%] pb-0 px-0 m-0 border-t border-p-mid rounded-b-lg">
                {renderActions(user)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

// 受け取ったアピール/スカウトに回答する「話してみる」「ごめんなさい」の2ボタン。
export const AnswerButtons = ({
  okAction,
  sorryAction,
}: {
  okAction: string;
  sorryAction: string;
}) => (
  <div className="flex">
    <div className="w-1/2 pr-[0.1%]">
      <form action={okAction} method="post">
        <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
        <button
          type="submit"
          className="w-full m-0 py-[1%] text-[30px] bg-p-brand text-white rounded hover:opacity-80"
        >
          話してみる
        </button>
      </form>
    </div>
    <div className="w-1/2 pl-[0.1%]">
      <form action={sorryAction} method="post">
        <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
        <button
          type="submit"
          className="w-full m-0 py-[1%] text-[30px] bg-red-600 text-white rounded hover:opacity-80"
        >
          ごめんなさい
        </button>
      </form>
    </div>
  </div>
);
