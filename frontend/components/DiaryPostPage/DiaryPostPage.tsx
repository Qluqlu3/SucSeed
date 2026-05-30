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
      <h1>日記投稿</h1>

      <FlashMessages flash={flash} />

      {errors.length > 0 && (
        <div
          id='error_explanation'
          className='mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700'
        >
          <ul>
            {errors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className='panel panel-default diary-panel'>
        <div className='panel-heading diary-panel-header'>
          <h3 className='panel-title'>
            <img
              src={avatarPath}
              className='rounded-full inline'
              width={50}
              height={50}
              alt={userName}
            />
            {userName}
          </h3>
        </div>

        <form action='/diary/post' method='post' encType='multipart/form-data'>
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
          <div className='panel-body main-panel'>
            <div>
              <textarea
                name='diary[content]'
                className='w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                placeholder='文章など'
                rows={10}
              />
            </div>
          </div>
          <div className='panel-footer text-right'>
            <button
              type='submit'
              className='rounded bg-p-brand px-5 py-2 text-white hover:opacity-80'
            >
              投稿
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
