// frontend/components/GalleryViewPage/GalleryViewPage.tsx
//
// /gallery/view ページ（ギャラリーアップロードフォーム）の React コンポーネント。
// POST /gallery/view → gallery#upload へ送信。

import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface Props {
  errors: string[];
  flash: Record<string, string>;
}

export const GalleryViewPage = ({ errors, flash }: Props) => (
  <>
    <FlashMessages flash={flash} />

    {errors.length > 0 && (
      <div className='alert alert-danger'>
        <ul>
          {errors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </div>
    )}

    <div className='flex justify-center'>
      <div className='w-full md:w-1/3'>
        <div className='right-box bg-[#F7F5FB] rounded-[13px] max-h-[70vh] mt-[1vh]'>
          <form action='/gallery/view' method='post' encType='multipart/form-data'>
            <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
            <div className='form-group'>
              <label htmlFor='gallery-view-file'>ファイルを選択する</label>
              <input
                type='file'
                id='gallery-view-file'
                name='gallery[data]'
                className='block mt-2'
                accept='image/jpg,image/jpeg,image/png'
              />
              <div className='text-black mt-[1vh] ml-[5%]'>
                <input
                  type='text'
                  name='gallery[tag_list]'
                  id='tagme'
                  placeholder='タグをカンマ区切りで入力'
                />
              </div>
              <div className='mt-[5vh] mr-[3%]'>
                <button
                  type='submit'
                  className='rounded bg-p-brand px-5 py-2 text-white hover:opacity-80'
                >
                  登録
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
);
