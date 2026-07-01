// frontend/components/DiaryPostPage/DiaryPostPage.tsx
//
// /diary/post ページ（日記投稿フォーム単体）の React コンポーネント。
// POST /diary/post へ送信。

import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface Props {
  errors: string[];
  userName: string;
  avatarPath: string;
  flash: Record<string, string>;
}

export const DiaryPostPage = ({ errors, userName, avatarPath, flash }: Props) => {
  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">日記投稿</h1>

      <FlashMessages flash={flash} />

      {errors.length > 0 && (
        <div
          id="error_explanation"
          className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700"
        >
          <ul>
            {errors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-[7px] border border-p-mid bg-p-light">
        <div className="flex items-center gap-2 rounded-t-[7px] bg-p-brand p-2 text-white">
          <img
            src={avatarPath}
            className="inline rounded-full"
            width={50}
            height={50}
            alt={userName}
          />
          <h3 className="text-[23px]">{userName}</h3>
        </div>

        <form action="/diary/post" method="post" encType="multipart/form-data">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <div className="p-4">
            <textarea
              name="diary[content]"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
              placeholder="文章など"
              rows={10}
            />
          </div>
          <div className="p-4 text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-white hover:opacity-80"
            >
              投稿
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
