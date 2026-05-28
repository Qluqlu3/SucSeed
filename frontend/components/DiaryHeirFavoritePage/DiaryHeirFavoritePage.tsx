// frontend/components/DiaryHeirFavoritePage/DiaryHeirFavoritePage.tsx
//
// /diary/heir/favorite ページ（後継者側お気に入り日記一覧）の React コンポーネント。
// DiarySelectPage と構造は同じ。後継者ログイン時のみアクセス可能。

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

export const DiaryHeirFavoritePage = ({ diaries, currentUser, flash }: Props) => {
  return (
    <>
      <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>日記</h1>

      <FlashMessages flash={flash} />

      <div className='pt-[23px] w-full min-h-[110vh] mx-auto'>
        <div className='flex flex-wrap w-full !mx-0 pl-[1%] pr-[1%]'>
          <div className='w-full bg-[#275D39] border border-[#1F4B2E] rounded-[7px] pl-[1%] pb-[5%] min-h-[55vh]'>
            {diaries.length === 0 ? (
              <p className='text-[39px] text-white'>まだありません</p>
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
