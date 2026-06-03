// frontend/components/MyDiaryPage/MyDiaryPage.tsx
//
// /diary/my_diary ページ（マイ日記）の React コンポーネント。
// 右コラムに投稿フォームを持ち、投稿後に fetch で日記を追加する。

import { useState } from 'react';
import { postForm } from '../../utils/postForm';
import { DiaryCard, type DiaryEntry } from '../DiaryCard/DiaryCard';
import { FlashMessages } from '../FlashMessages';

interface CurrentUser {
  id: number;
  name: string;
  avatarPath: string;
}

interface Props {
  diaries: DiaryEntry[];
  errors: string[];
  currentUser: CurrentUser;
  flash: Record<string, string>;
}

export const MyDiaryPage = ({ diaries: initialDiaries, errors, currentUser, flash }: Props) => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>(initialDiaries);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || posting) return;
    setPosting(true);
    const body = new FormData();
    body.append('diary[content]', content);
    body.append('diary[user_id]', String(currentUser.id));
    const res = await postForm('/diary/post', body);
    if (res.redirected || res.ok) {
      const tempId = Date.now();
      setDiaries((prev) => [
        {
          diaryId: tempId,
          userId: currentUser.id,
          name: currentUser.name,
          avatarPath: currentUser.avatarPath,
          content,
          postTime: new Date().toLocaleString('ja-JP'),
          goodCount: 0,
          goodAvatars: [],
          myGood: false,
          comments: [],
          commentCount: 0,
        },
        ...prev,
      ]);
      setContent('');
    }
    setPosting(false);
  };

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">マイ日記</h1>

      <FlashMessages flash={flash} />

      {errors.length > 0 && (
        <div id="error_explanation" className="error-box">
          <p className="error-title">入力内容にエラーが{errors.length}件あります</p>
          <ul className="error-index">
            {errors.map((msg) => (
              <li key={msg} className="error-content">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-[23px] w-full min-h-[110vh] mx-auto">
        <div className="flex flex-wrap w-full !mx-0 pl-[1%]">
          {/* 左カラム：日記一覧 */}
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
                  canDelete={true}
                />
              ))
            )}
          </div>

          {/* 右カラム：投稿フォーム */}
          <div className="w-full md:w-3/12 h-[60vh] bg-[#275D39] border border-[#1F4B2E] rounded-[7px] pl-[1%] pb-[5%]">
            <div>
              <div className="mt-[8%] border-2 border-[#D3C9E7] rounded-[5px]">
                <div className="pt-[1.3%] pb-[0.8%] pl-[1.5%] bg-[#FCF2D3] rounded-t-[5px] text-[23px]">
                  <img
                    src={currentUser.avatarPath}
                    className="rounded-full"
                    width={60}
                    height={60}
                    alt={currentUser.name}
                  />
                  {currentUser.name}
                </div>
                <form onSubmit={handlePost}>
                  <div>
                    <textarea
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                      placeholder="文章など"
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className="bg-p-brand text-right">
                    <button
                      type="submit"
                      className="rounded bg-[#FFA30D] py-2 px-4 text-black hover:opacity-80"
                      disabled={posting}
                    >
                      投稿
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
