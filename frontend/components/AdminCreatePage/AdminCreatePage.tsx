// frontend/components/AdminCreatePage/AdminCreatePage.tsx
//
// /admin/create/07392 ページの React コンポーネント。
// 管理者アカウント登録フォーム。POST /admin/create/user。
//
// 【data-props】
//   errors: string[]

import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface Props {
  errors: string[];
  flash: Record<string, string>;
}

export const AdminCreatePage = ({ errors, flash }: Props) => (
  <div className='bg-white'>
    <h1 className='text-center text-[60px]'>管理者登録</h1>

    <FlashMessages flash={flash} />
    {errors.length > 0 && (
      <div id='error_explanation' className='error-box w-[65%] mx-auto border-2 border-[#FF4C4C]'>
        <p className='error-title'>入力内容にエラーが{errors.length}件あります</p>
        <ul className='error-index'>
          {errors.map((msg) => (
            <li key={msg} className='error-content'>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className='w-[60%] mx-auto'>
      <div className='py-[2%] px-[1%] bg-[#DDD] rounded-[7px]'>
        <form action='/admin/create/user' method='post'>
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
          <div className='mt-[2%] mb-[3%] md:flex md:items-center'>
            <label htmlFor='admin_user_id' className='block md:w-1/6 mb-1 md:mb-0'>
              ユーザーID
            </label>
            <div className='md:w-5/6'>
              <input
                type='text'
                id='admin_user_id'
                name='admin[user_id]'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-p-brand'
                placeholder='ユーザーID'
              />
            </div>
          </div>
          <div className='mt-[2%] mb-[3%] md:flex md:items-center'>
            <label htmlFor='admin_name' className='block md:w-1/6 mb-1 md:mb-0'>
              名前
            </label>
            <div className='md:w-5/6'>
              <input
                type='text'
                id='admin_name'
                name='admin[name]'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-p-brand'
                placeholder='名前'
              />
            </div>
          </div>
          <div className='mt-[2%] mb-[3%] md:flex md:items-center'>
            <label htmlFor='admin_password' className='block md:w-1/6 mb-1 md:mb-0'>
              パスワード
            </label>
            <div className='md:w-5/6'>
              <input
                type='password'
                id='admin_password'
                name='admin[password]'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-p-brand'
                placeholder='パスワード'
              />
            </div>
          </div>
          <div className='mt-[2%] mb-[3%] md:flex md:items-center'>
            <label htmlFor='admin_password_confirmation' className='block md:w-1/6 mb-1 md:mb-0'>
              パスワード確認
            </label>
            <div className='md:w-5/6'>
              <input
                type='password'
                id='admin_password_confirmation'
                name='admin[password_confirmation]'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-p-brand'
                placeholder='パスワード確認'
              />
            </div>
          </div>
          <div className='text-right'>
            <button
              type='submit'
              className='px-5 py-2 bg-p-brand text-white rounded hover:opacity-80 text-lg'
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
