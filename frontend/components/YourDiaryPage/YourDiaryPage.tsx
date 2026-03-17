// frontend/components/YourDiaryPage/YourDiaryPage.tsx
//
// /diary/show/:id ページ（相手ユーザーの日記一覧）の React コンポーネント。
// 未ログインでも閲覧可能だが、いいね・コメントはログイン必須。

import { DiaryCard, type DiaryEntry } from '../DiaryCard/DiaryCard';

interface CurrentUser {
  id: number;
  name: string;
  avatarPath: string;
}

interface Props {
  diaries: DiaryEntry[];
  ownerName: string;
  currentUser: CurrentUser | null;
}

export const YourDiaryPage = ({ diaries, ownerName, currentUser }: Props) => {
  return (
    <>
      <h1 className="main-title">{ownerName}さんの日記</h1>
      <div className="wrapper">
        <div className="row your-diary-row">
          <div className="col-md-12 diary-box">
            {diaries.length === 0 ? (
              <p className="empty-text">まだありません</p>
            ) : (
              diaries.map((entry) => (
                <DiaryCard
                  key={entry.diaryId}
                  entry={entry}
                  currentUserId={currentUser?.id ?? null}
                  currentUserName={currentUser?.name ?? null}
                  currentUserAvatar={currentUser?.avatarPath ?? null}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
