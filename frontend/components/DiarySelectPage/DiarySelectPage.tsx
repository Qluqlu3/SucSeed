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
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">日記</h1>

      <FlashMessages flash={flash} />

      <div className="pt-[23px] w-full min-h-[110vh] mx-auto">
        <div className="flex flex-wrap w-full !mx-0 pl-[1%]">
          <div className="w-full md:w-9/12 bg-[#275D39] border border-[#1F4B2E] rounded-[7px] pl-[1%] pb-[5%]">
            {diaries.length === 0 ? (
              <p className="text-[39px] text-white">まだありません</p>
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
