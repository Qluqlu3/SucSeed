// frontend/components/AppealShowPage/AppealShowPage.tsx
//
// /match/appeal/list_check ページの React コンポーネント。
// 後継者がアピールした職人一覧を表示する。
//
// 【data-props に含まれるデータ】
//   appeals : [{ pageId, name, birthday, avatarPath, title, matchTime, isOk }]

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

export const AppealShowPage = ({ appeals }: Props) => (
  <div>
    <h1 className="main-title">アピール確認</h1>
    <div className="all-cover-box">
      <div className="wrapper">
        {appeals.length === 0 ? (
          <p className="empty-text">まだありません</p>
        ) : (
          appeals.map((appeal) => (
            <div key={appeal.pageId} className="card list-card">
              <div className="card-header list-card-header">
                {appeal.matchTime}&nbsp;{timeAgo(appeal.matchTime)}前
              </div>
              <a href={`/page/creator/${appeal.pageId}`}>
                <div className="card-body list-card-body">
                  <div className="row">
                    <div className="col-5 left-col text-center">
                      <img
                        src={appeal.avatarPath}
                        className="img-circle"
                        width={230}
                        height={230}
                        alt={appeal.name}
                      />
                    </div>
                    <div className="col-7 right-col">
                      <p className="name-text">{appeal.name}</p>
                      <p className="age-text">
                        {calcAge(appeal.birthday)}
                        <small>歳</small>
                      </p>
                      <p className="title-text">{appeal.title}</p>
                    </div>
                  </div>
                </div>
              </a>
              <div className="card-footer list-card-footer">
                <div className="row">
                  {appeal.isOk ? (
                    <div className="col">
                      <a href="#">
                        <p>メッセージ</p>
                      </a>
                    </div>
                  ) : (
                    <div className="col">
                      <p className="btn btn-primary yes-btn">アピール済</p>
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
