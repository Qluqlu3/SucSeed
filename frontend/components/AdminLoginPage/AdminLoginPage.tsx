// frontend/components/AdminLoginPage/AdminLoginPage.tsx
//
// /admin/login ページの React コンポーネント。
// フォームは POST /admin/login。
//
// 【data-props】なし（props なし）

import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface Props {
  flash: Record<string, string>;
}

export const AdminLoginPage = ({ flash }: Props) => (
  <div className='bg-white'>
    <h1 className='text-center text-[60px]'>管理者ログイン</h1>

    <FlashMessages flash={flash} />
    <div className='admin-wrapper'>
      <div className='w-1/2 mx-auto py-[3%] px-[5%] bg-[#DDD] rounded-[7px]'>
        <form action='/admin/login' method='post'>
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
          <div className='mb-4'>
            <label htmlFor='admin_user_id' className='block mb-1'>
              ユーザーID
            </label>
            <input
              type='text'
              id='admin_user_id'
              name='admin[user_id]'
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-p-brand'
              placeholder='ユーザーID'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='admin_password' className='block mb-1'>
              パスワード
            </label>
            <input
              type='password'
              id='admin_password'
              name='admin[password]'
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-p-brand'
              placeholder='パスワード'
            />
          </div>
          <div className='text-right'>
            <button
              type='submit'
              className='px-4 py-2 bg-p-brand text-white rounded hover:opacity-80'
            >
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
