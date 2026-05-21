// frontend/components/AppealedListPage/AppealedListPage.tsx
//
// /match/appealed/list ページの React コンポーネント。
// 職人がアピールされた後継者リストを表示し、OK/NGを送信する。
//
// 【data-props に含まれるデータ】
//   matches : [{ pageId, name, birthday, avatarPath, matchTime }]
import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface MatchUser {
  pageId: string;
  name: string;
  birthday: string;
  avatarPath: string;
  matchTime: string;
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

export const AppealedListPage = ({ matches, flash }: Props) => (
  <div>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>アピールリスト</h1>

    <FlashMessages flash={flash} />
    <div className='min-h-screen'>
      <div className='w-[93%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]'>
        {matches.length === 0 ? (
          <p className='mb-[60vh] text-[39px] text-p-dark'>まだありません</p>
        ) : (
          matches.map((match) => (
            <div key={match.pageId} className='card mb-[1%]'>
              <div className='card-header bg-[#BAA9DA]'>
                {match.matchTime}&nbsp;{timeAgo(match.matchTime)}前
              </div>
              <a href={`/page/heir/${match.pageId}`}>
                <div className='card-body bg-white'>
                  <div className='row'>
                    <div className='col-5 text-center'>
                      <img
                        src={match.avatarPath}
                        className='rounded-circle'
                        width={230}
                        height={230}
                        alt={match.name}
                      />
                    </div>
                    <div className='col-7 text-left'>
                      <p className='text-[61px] p-0 m-0'>{match.name}</p>
                      <p className='text-[35px] p-0 my-[1%] ml-[71px]'>
                        {calcAge(match.birthday)}
                        <small>歳</small>
                      </p>
                    </div>
                  </div>
                </div>
              </a>
              <div className='card-footer pt-[0.2%] pb-0 px-0 m-0'>
                <div className='row'>
                  <div className='col-6 pr-[0.1%]'>
                    <form action={`/match/ok/${match.pageId}`} method='post'>
                      <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                      <button
                        type='submit'
                        className='btn btn-primary w-full m-0 py-[1%] text-[30px]'
                      >
                        話してみる
                      </button>
                    </form>
                  </div>
                  <div className='col-6 pl-[0.1%]'>
                    <form action={`/match/sorry/${match.pageId}`} method='post'>
                      <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                      <button
                        type='submit'
                        className='btn btn-danger w-full m-0 py-[1%] text-[30px]'
                      >
                        ごめんなさい
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
