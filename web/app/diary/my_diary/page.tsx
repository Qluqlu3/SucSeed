'use client';

// web/app/diary/my_diary/page.tsx
//
// マイ日記。Rails の DiaryController#my_diary を置き換える。
// 一覧は GET /api/v1/diaries?user_id=自分、右の投稿フォームは POST /api/v1/diaries
// （Rails 版の画面も既に API で投稿していた）。投稿した日記は API が返したものを先頭に差し込む。

import { api, type DiaryFeedItem } from '@sucseed/api';
import { FlashMessages } from '@sucseed/ui';
import { type FormEvent, useEffect, useState } from 'react';
import { useAllDiaries } from '../../../lib/diaries';
import { isAuthError, redirectToLogin, useRequireLogin } from '../../../lib/session';
import { useCurrentUser } from '../../../lib/users';
import { DiaryCards } from '../_components/DiaryCards';

export default function MyDiaryPage() {
  const loggedIn = useRequireLogin() !== null;
  const currentUser = useCurrentUser(loggedIn);
  const { diaries: fetched, error } = useAllDiaries(Boolean(currentUser), currentUser?.id);
  const [diaries, setDiaries] = useState<DiaryFeedItem[] | null>(null);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // 投稿した日記を差し込めるよう、取得した一覧を手元の state に移す
  useEffect(() => {
    setDiaries(fetched);
  }, [fetched]);

  if (!loggedIn || !currentUser || (diaries === null && error === null)) {
    return null;
  }

  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim() || posting) {
      return;
    }
    setPosting(true);
    setPostError(null);
    const result = await api.diaries.create(content);
    setPosting(false);
    if (result.ok) {
      setDiaries((current) => [result.data, ...(current ?? [])]);
      setContent('');
    } else if (isAuthError(result.error)) {
      redirectToLogin();
    } else {
      setPostError(result.error.details[0] ?? result.error.message);
    }
  };

  const message = error ?? postError;

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">マイ日記</h1>

      <FlashMessages flash={message ? { danger: message } : {}} />

      <div className="pt-[23px] w-full min-h-[110vh] mx-auto">
        <div className="flex flex-wrap w-full !mx-0 pl-[1%]">
          {/* 左カラム：日記一覧 */}
          <div className="w-full md:w-9/12 bg-p-dark border border-p-brand rounded-[7px] pl-[1%] pb-[5%]">
            <DiaryCards diaries={diaries ?? []} currentUser={currentUser} canDelete />
          </div>

          {/* 右カラム：投稿フォーム */}
          <div className="w-full md:w-3/12 h-[60vh] bg-p-dark border border-p-brand rounded-[7px] pl-[1%] pb-[5%]">
            <div>
              <div className="mt-[8%] border-2 border-[#D3C9E7] rounded-[5px]">
                <div className="pt-[1.3%] pb-[0.8%] pl-[1.5%] bg-p-light rounded-t-[5px] text-[23px]">
                  {/* biome-ignore lint/performance/noImgElement: アップロード画像は Rails から中継して配るので next/image を通さない */}
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
                      onChange={(event) => setContent(event.target.value)}
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
}
