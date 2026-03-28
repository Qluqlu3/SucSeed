// frontend/components/ScoutCheckPage/ScoutCheckPage.tsx
//
// /match/scout/check ページの React コンポーネント。
// 後継者がスカウトされた職人リストを表示し、OK/NGを送信する。
//
// 【data-props に含まれるデータ】
//   scouts : [{ pageId, name, birthday, avatarPath, matchTime, title }]
import { getCsrfToken } from '../../utils/csrf';
// ── 型定義 ──────────────────────────────────────────────────────────
interface ScoutUser {
  pageId: string;
  name: string;
  birthday: string;
  avatarPath: string;
  matchTime: string;
  title: string;
}

interface Props {
  scouts: ScoutUser[];
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

export const ScoutCheckPage = ({ scouts }: Props) => (
  <div>
    <h1 className='main-title'>スカウト確認</h1>
    <div className='all-cover-box'>
      <div className='wrapper'>
        {scouts.length === 0 ? (
          <p className='empty-text'>まだありません</p>
        ) : (
          scouts.map((scout) => (
            <div key={scout.pageId} className='card list-card'>
              <div className='card-header list-card-header'>
                {scout.matchTime}&nbsp;{timeAgo(scout.matchTime)}前
              </div>
              <a href={`/page/creator/${scout.pageId}`}>
                <div className='card-body list-card-body'>
                  <div className='row'>
                    <div className='col-5 left-col text-center'>
                      <img
                        src={scout.avatarPath}
                        className='img-circle'
                        width={230}
                        height={230}
                        alt={scout.name}
                      />
                    </div>
                    <div className='col-7 right-col'>
                      <p className='name-text'>{scout.name}</p>
                      <p className='age-text'>
                        {calcAge(scout.birthday)}
                        <small>歳</small>
                      </p>
                      <p className='title-text'>{scout.title}</p>
                    </div>
                  </div>
                </div>
              </a>
              <div className='card-footer list-card-footer'>
                <div className='row'>
                  <div className='col-6 left-btn-col'>
                    <form action={`/scout/ok/${scout.pageId}`} method='post'>
                      <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                      <button type='submit' className='btn btn-primary yes-btn'>
                        話してみる
                      </button>
                    </form>
                  </div>
                  <div className='col-6 right-btn-col'>
                    <form action={`/scout/sorry/${scout.pageId}`} method='post'>
                      <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                      <button type='submit' className='btn btn-danger no-btn'>
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
