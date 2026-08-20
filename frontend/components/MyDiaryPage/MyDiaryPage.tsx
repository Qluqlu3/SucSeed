// frontend/components/MyDiaryPage/MyDiaryPage.tsx
//
// /diary/my_diary ページ（マイ日記）の React コンポーネント。
// 右コラムに投稿フォームを持ち、投稿後は API が返した日記をそのまま一覧に差し込む。

import { useState } from 'react';
import type { Id } from '../../api';
import { api } from '../../api';
import { DiaryCard, type DiaryEntry } from '../DiaryCard/DiaryCard';
import { FlashMessages } from '../FlashMessages';

interface CurrentUser {
  id: Id;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 旧実装は Date.now() の仮 ID とクライアント側の日時でカードを組み立てていたため、
  // 投稿直後だけ実データと形が違っていた（削除やいいねも仮 ID では動かない）。
  // API が返す本物の日記をそのまま差し込む。
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || posting) return;

    setPosting(true);
    setErrorMessage(null);
    const result = await api.diaries.create(content);
    setPosting(false);

    if (result.ok) {
      setDiaries((prev) => [result.data, ...prev]);
      setContent('');
    } else {
      setErrorMessage(result.error.details[0] ?? result.error.message);
    }
  };

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">マイ日記</h1>

      {/* API エラーはサーバー由来の flash と同じ見た目で出す */}
      <FlashMessages flash={errorMessage ? { ...flash, danger: errorMessage } : flash} />

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
          <div className="w-full md:w-9/12 bg-p-dark border border-p-brand rounded-[7px] pl-[1%] pb-[5%]">
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
          <div className="w-full md:w-3/12 h-[60vh] bg-p-dark border border-p-brand rounded-[7px] pl-[1%] pb-[5%]">
            <div>
              <div className="mt-[8%] border-2 border-[#D3C9E7] rounded-[5px]">
                <div className="pt-[1.3%] pb-[0.8%] pl-[1.5%] bg-p-light rounded-t-[5px] text-[23px]">
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
                      className="rounded bg-p-gold py-2 px-4 text-black hover:opacity-80"
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
