// frontend/components/DiarySelectPage/DiarySelectPage.tsx
//
// /diary/view ページ（お気に入りユーザーの日記一覧）の React コンポーネント。

import { DiaryCard, type DiaryEntry } from '../DiaryCard/DiaryCard';
import { FlashMessages } from '../FlashMessages';

interface CurrentUser {
  id: number;
  name: string;
  avatarPath: string;
}

interface Props {
  diaries: DiaryEntry[];
  currentUser: CurrentUser;
  flash: Record<string, string>;
}

export const DiarySelectPage = ({ diaries, currentUser, flash }: Props) => {
  return (
    <>
      <h1 className='main-title'>日記</h1>

      <FlashMessages flash={flash} />

      <div className='wrapper'>
        <div className='row my-row'>
          <div className='col-md-9 left-col'>
            {diaries.length === 0 ? (
              <p className='empty-text'>まだありません</p>
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
