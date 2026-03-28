// frontend/components/AppealedListPage/AppealedListPage.tsx
//
// /match/appealed/list ページの React コンポーネント。
// 職人がアピールされた後継者リストを表示し、OK/NGを送信する。
//
// 【data-props に含まれるデータ】
//   matches : [{ pageId, name, birthday, avatarPath, matchTime }]
import { getCsrfToken } from '../../utils/csrf';

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

export const AppealedListPage = ({ matches }: Props) => (
  <div>
    <h1 className="main-title">アピールリスト</h1>
    <div className="all-cover-box">
      <div className="wrapper">
        {matches.length === 0 ? (
          <p className="empty-text">まだありません</p>
        ) : (
          matches.map((match) => (
            <div key={match.pageId} className="card list-card">
              <div className="card-header list-card-header">
                {match.matchTime}&nbsp;{timeAgo(match.matchTime)}前
              </div>
              <a href={`/page/heir/${match.pageId}`}>
                <div className="card-body list-card-body">
                  <div className="row">
                    <div className="col-5 left-col text-center">
                      <img
                        src={match.avatarPath}
                        className="rounded-circle"
                        width={230}
                        height={230}
                        alt={match.name}
                      />
                    </div>
                    <div className="col-7 right-col">
                      <p className="name-text">{match.name}</p>
                      <p className="age-text">
                        {calcAge(match.birthday)}
                        <small>歳</small>
                      </p>
                    </div>
                  </div>
                </div>
              </a>
              <div className="card-footer list-card-footer">
                <div className="row">
                  <div className="col-6 left-btn-col">
                    <form action={`/match/ok/${match.pageId}`} method="post">
                      <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
                      <button type="submit" className="btn btn-primary yes-btn">
                        話してみる
                      </button>
                    </form>
                  </div>
                  <div className="col-6 right-btn-col">
                    <form action={`/match/sorry/${match.pageId}`} method="post">
                      <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
                      <button type="submit" className="btn btn-danger no-btn">
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
