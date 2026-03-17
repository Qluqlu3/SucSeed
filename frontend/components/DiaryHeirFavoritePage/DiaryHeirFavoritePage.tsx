// frontend/components/DiaryHeirFavoritePage/DiaryHeirFavoritePage.tsx
//
// /diary/heir/favorite ページ（後継者側お気に入り日記一覧）の React コンポーネント。
// DiarySelectPage と構造は同じ。後継者ログイン時のみアクセス可能。

import { DiaryCard, type DiaryEntry } from '../DiaryCard/DiaryCard';

interface CurrentUser {
  id: number;
  name: string;
  avatarPath: string;
}

interface Props {
  diaries: DiaryEntry[];
  currentUser: CurrentUser;
}

export const DiaryHeirFavoritePage = ({ diaries, currentUser }: Props) => {
  return (
    <>
      <h1 className="main-title">日記</h1>
      <div className="wrapper">
        <div className="row my-row heir-row">
          <div className="col-md-12 left-col heir-favorite-box">
            {diaries.length === 0 ? (
              <p className="empty-text">まだありません</p>
            ) : (
              diaries.map((entry) => (
                <DiaryCard
                  key={entry.diaryId}
                  entry={entry}
                  currentUserId={currentUser.id}
                  currentUserName={currentUser.name}
                  currentUserAvatar={currentUser.avatarPath}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
