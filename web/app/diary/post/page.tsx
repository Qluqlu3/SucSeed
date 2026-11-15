'use client';

// web/app/diary/post/page.tsx
//
// 日記の投稿フォーム（職人のみ）。Rails の DiaryController#regist と post を置き換える。
// 投稿は POST /api/v1/diaries。成功したら Rails と同じく「保存しました」を出してマイ日記へ移る。
// Rails は失敗してもマイ日記へ移っていたが、ここでは入力を残したままこの画面でエラーを出す。

import { api } from '@sucseed/api';
import { type Flash, FlashMessages, pushFlash } from '@sucseed/ui';
import { type FormEvent, useState } from 'react';
import { isAuthError, isCreator, redirectToLogin, useRequireRole } from '../../../lib/session';
import { useCurrentUser } from '../../../lib/users';

// Rails の flash（t('flash.success.saved') / t('flash.danger.error')）と同じ文言
const SAVED = '保存しました';
const FAILED = 'エラーが発生しました';

export default function DiaryPostPage() {
  const allowed = useRequireRole(isCreator) !== null;
  const currentUser = useCurrentUser(allowed);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [flash, setFlash] = useState<Flash>({});

  if (!allowed || !currentUser) {
    return null;
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPosting(true);
    setFlash({});
    const result = await api.diaries.create(content);
    if (result.ok) {
      pushFlash('success', SAVED);
      // マイ日記は Next の画面だが、積んだ flash を出すため読み込み直す
      window.location.assign('/diary/my_diary');
      return;
    }
    setPosting(false);
    if (isAuthError(result.error)) {
      redirectToLogin();
    } else {
      setFlash({ danger: FAILED });
    }
  };

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">日記投稿</h1>

      <FlashMessages flash={flash} />

      <div className="rounded-[7px] border border-p-mid bg-p-light">
        <div className="flex items-center gap-2 rounded-t-[7px] bg-p-brand p-2 text-white">
          {/* biome-ignore lint/performance/noImgElement: アップロード画像は Rails から中継して配るので next/image を通さない */}
          <img
            src={currentUser.avatarPath}
            className="inline rounded-full"
            width={50}
            height={50}
            alt={currentUser.name}
          />
          <h3 className="text-[23px]">{currentUser.name}</h3>
        </div>

        <form onSubmit={submit}>
          <div className="p-4">
            <textarea
              name="diary[content]"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
              placeholder="文章など"
              rows={10}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
          <div className="p-4 text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-white hover:opacity-80"
              disabled={posting}
            >
              投稿
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
