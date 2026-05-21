// frontend/components/AppealShowPage/AppealShowPage.tsx
//
// /match/appeal/list_check ページの React コンポーネント。
// 後継者がアピールした職人一覧を表示する。
//
// 【data-props に含まれるデータ】
//   appeals : [{ pageId, name, birthday, avatarPath, title, matchTime, isOk }]

import { FlashMessages } from '../FlashMessages';
import { getCsrfToken } from '../../utils/csrf';

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

export const AppealShowPage = ({ appeals, flash }: Props) => (
  <div>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>アピール確認</h1>

    <FlashMessages flash={flash} />

    <div className='min-h-screen'>
      <div className='w-[93%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]'>
        {appeals.length === 0 ? (
          <p className='mb-[60vh] text-[39px] text-p-dark'>まだありません</p>
        ) : (
          appeals.map((appeal) => (
            <div key={appeal.pageId} className='card mb-[1%]'>
              <div className='card-header bg-[#BAA9DA]'>
                {appeal.matchTime}&nbsp;{timeAgo(appeal.matchTime)}前
              </div>
              <a href={`/page/creator/${appeal.pageId}`}>
                <div className='card-body bg-white'>
                  <div className='row'>
                    <div className='col-5 text-center'>
                      <img
                        src={appeal.avatarPath}
                        className='img-circle'
                        width={230}
                        height={230}
                        alt={appeal.name}
                      />
                    </div>
                    <div className='col-7 text-left'>
                      <p className='text-[61px] p-0 m-0'>{appeal.name}</p>
                      <p className='text-[35px] p-0 my-[1%] ml-[71px]'>
                        {calcAge(appeal.birthday)}
                        <small>歳</small>
                      </p>
                      <p className='text-[47px] p-0 m-0'>{appeal.title}</p>
                    </div>
                  </div>
                </div>
              </a>
              <div className='card-footer pt-[0.2%] pb-0 px-0 m-0'>
                <div className='row'>
                  {appeal.isOk ? (
                    <div className='col'>
                      <form action={`/message/add/${appeal.pageId}`} method='post'>
                        <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                        <button type='submit' className='btn btn-link p-0'>
                          <p>メッセージ</p>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className='col'>
                      <p className='btn btn-primary w-full m-0 py-[1%] text-[30px]'>アピール済</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
