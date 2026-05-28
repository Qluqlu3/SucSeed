// frontend/components/AdminSelectedUserEditPage/AdminSelectedUserEditPage.tsx
//
// /admin/user/edit/:id ページの React コンポーネント。
// アバター画像変更 + プロフィール編集フォーム。PATCH /admin/user/edit/:id。
//
// 【data-props】
//   user: { id, avatarPath, profile }

import { getCsrfToken } from '../../utils/csrf';
import { AdminSideMenu } from '../AdminSideMenu';
import { FlashMessages } from '../FlashMessages';

interface Props {
  user: {
    id: number;
    avatarPath: string;
    profile: string;
  };
  flash: Record<string, string>;
}

export const AdminSelectedUserEditPage = ({ user, flash }: Props) => (
  <div className='w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap'>
    <AdminSideMenu />
    <div className='w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll'>
      <h1 className='text-center text-[60px]'>ユーザー編集</h1>

      <FlashMessages flash={flash} />
      <form
        action={`/admin/user/edit/${user.id}`}
        method='post'
        encType='multipart/form-data'
        onSubmit={(e) => {
          if (!window.confirm('変更しますか？')) e.preventDefault();
        }}
      >
        <input type='hidden' name='_method' value='patch' />
        <input type='hidden' name='authenticity_token' value={getCsrfToken()} />

        {/* アバター */}
        <div className='rounded-lg border border-p-mid bg-white'>
          <div className='p-4'>
            <img
              src={user.avatarPath}
              className='rounded-full'
              alt='アバター画像'
              style={{ width: '100%', height: '100%' }}
            />
            <input
              type='file'
              name='user[avatar_path]'
              className='block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50'
              id='exampleFormControlFile1'
              accept='image/jpg,image/jpeg,image/png'
            />
          </div>
        </div>

        {/* プロフィール */}
        <div className='rounded-lg border border-p-mid bg-white mt-4'>
          <div className='p-4'>
            <textarea
              name='user[profile]'
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-p-brand'
              placeholder='紹介文'
              rows={15}
              cols={20}
              defaultValue={user.profile}
            />
          </div>
        </div>

        {/* 送信 */}
        <div className='rounded-lg border border-p-mid bg-white mt-4 text-right'>
          <div className='p-4'>
            <button
              type='submit'
              className='px-5 py-2 bg-[#f0ad4e] text-black rounded hover:opacity-80 text-lg'
            >
              変更
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);
