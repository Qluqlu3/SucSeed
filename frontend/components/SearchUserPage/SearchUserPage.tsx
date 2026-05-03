// frontend/components/SearchUserPage/SearchUserPage.tsx
//
// /index/search_user ページ全体の React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   creators : 検索結果の職人一覧

import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface Creator {
  userId: string;
  name: string;
  title: string;
  avatarPath: string;
  createdAt: string;
}

interface Props {
  creators: Creator[];
  flash: Record<string, string>;
}

// ── ユーティリティ ───────────────────────────────────────────────────

// 登録から 3 日以内なら NEW バッジを表示する
const isNew = (createdAt: string): boolean => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return diffMs <= 3 * 24 * 60 * 60 * 1000;
};

// ── コンポーネント ───────────────────────────────────────────────────

export const SearchUserPage = ({ creators, flash }: Props) => (
  <>
    <FlashMessages flash={flash} />
    <div className="search-page-box">
    <div className="row card-group justify-content-center my-row">
      {creators.map((creator) => (
        <div key={creator.userId} className="col-lg-3 my-card-col new-box">
          <a href={`/page/creator/${creator.userId}`} className="nav-link">
            <div className="card profile-card new-tag-content">
              {isNew(creator.createdAt) && <span className="new-tag">NEW</span>}
              <div className="text-center">
                <img
                  src={creator.avatarPath}
                  className="rounded-circle avatar"
                  width={300}
                  height={300}
                  alt={creator.name}
                />
              </div>
              <div className="card-body">
                <h4 className="card-box-name text-center">{creator.name}</h4>
                <p className="card-box-title text-center">{creator.title}</p>
              </div>
            </div>
          </a>
        </div>
      ))}
      <div className="creator-card-last-bottom" />
    </div>
    </div>
  </>
);
