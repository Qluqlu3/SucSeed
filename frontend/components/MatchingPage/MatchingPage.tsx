// frontend/components/MatchingPage/MatchingPage.tsx
//
// /match/matching/list ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   matches : マッチング済みユーザー一覧
//             [{ id, name, birthday, avatarPath, matchTime, isAddList }]

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';

import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface MatchUser {
  id: string;
  name: string;
  birthday: string;
  avatarPath: string;
  matchTime: string;
  // is_add_list: 0 = 未追加、1 = 追加済み
  isAddList: number;
}

interface Props {
  matches: MatchUser[];
  flash: Record<string, string>;
}

// ── ユーティリティ ───────────────────────────────────────────────────

function calcAge(birthday: string): number {
  const fmt = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return Math.floor((fmt(new Date()) - fmt(new Date(birthday))) / 10000);
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}分`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}ヶ月`;
  return `${Math.floor(months / 12)}年`;
}

// ── コンポーネント ───────────────────────────────────────────────────

const MessageForm = ({ userId }: { userId: string }) => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form action={`/message/add/${userId}`} method='post' onSubmit={() => setSubmitted(true)}>
      <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
      <button
        type='submit'
        className='w-full m-0 py-[1%] text-[30px] bg-green-600 text-white rounded hover:opacity-80'
        disabled={submitted}
      >
        メッセージ
      </button>
    </form>
  );
};

export const MatchingPage = ({ matches, flash }: Props) => (
  <div>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>マッチングリスト</h1>

    <FlashMessages flash={flash} />

    <div className='min-h-screen'>
      <div className='w-[93%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]'>
        {matches.length === 0 ? (
          <p className='mb-[60vh] text-[39px] text-p-dark'>まだありません</p>
        ) : (
          matches.map((match) => (
            <div key={match.id} className='mb-[1%] rounded-lg border border-p-mid'>
              <div className='px-4 py-2 bg-[#BAA9DA] rounded-t-lg'>
                {match.matchTime}&nbsp;{timeAgo(match.matchTime)}前
              </div>
              <a href={`/page/heir/${match.id}`}>
                <div className='p-4 bg-white'>
                  <div className='flex flex-wrap'>
                    <div className='w-5/12 text-center'>
                      <img
                        src={match.avatarPath}
                        className='rounded-full'
                        width={230}
                        height={230}
                        alt={match.name}
                      />
                    </div>
                    <div className='w-7/12 text-left'>
                      <p className='text-[61px] p-0 m-0'>{match.name}</p>
                      <p className='text-[35px] p-0 my-[1%] ml-[71px]'>
                        {calcAge(match.birthday)}
                        <small>歳</small>
                      </p>
                    </div>
                  </div>
                </div>
              </a>
              <div className='pt-[0.2%] pb-0 px-0 m-0 border-t border-p-mid rounded-b-lg'>
                {match.isAddList === 0 && <MessageForm userId={match.id} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
