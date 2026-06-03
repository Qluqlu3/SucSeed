// frontend/components/YourDiaryPage/YourDiaryPage.tsx
//
// /diary/show/:id ページ（相手ユーザーの日記一覧）の React コンポーネント。
// 未ログインでも閲覧可能だが、いいね・コメントはログイン必須。

import { DiaryCard, type DiaryEntry } from '../DiaryCard/DiaryCard';
import { FlashMessages } from '../FlashMessages';

interface CurrentUser {
  id: number;
  name: string;
  avatarPath: string;
}

interface Props {
  diaries: DiaryEntry[];
  ownerName: string;
  currentUser: CurrentUser | null;
  flash: Record<string, string>;
}

export const YourDiaryPage = ({ diaries, ownerName, currentUser, flash }: Props) => {
  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
        {ownerName}さんの日記
      </h1>

      <FlashMessages flash={flash} />

      <div className="pt-[23px] w-full min-h-[110vh] mx-auto">
        <div className="flex flex-wrap w-full !mx-0 px-[1%]">
          <div className="w-full bg-[#275D39] border border-[#1F4B2E] rounded-[7px] px-[1%] pb-[5%]">
            {diaries.length === 0 ? (
              <p className="text-[39px] text-white">まだありません</p>
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
