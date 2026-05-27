// frontend/components/AdminInquiryDetailPage/AdminInquiryDetailPage.tsx
//
// /admin/inquiry/detail/:id ページの React コンポーネント。
// 問い合わせ詳細カード + 対応チェックフォーム。
//
// 【data-props】
//   inquiryDetail: { id, categoryName, content, createdAt }
//   isCheck: boolean

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';
import { AdminSideMenu } from '../AdminSideMenu';
import { FlashMessages } from '../FlashMessages';

interface Props {
  inquiryDetail: {
    id: number;
    categoryName: string;
    content: string;
    createdAt: string;
  };
  isCheck: boolean;
  flash: Record<string, string>;
}

export const AdminInquiryDetailPage = ({ inquiryDetail, isCheck, flash }: Props) => {
  const [checked, setChecked] = useState(isCheck);

  return (
    <div className='w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap'>
      <AdminSideMenu activeKey='inquiry' />
      <div className='w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll'>
        <h1 className='text-center text-[60px]'>ユーザー編集</h1>

        <FlashMessages flash={flash} />

        <div className='rounded-lg border border-p-mid bg-white'>
          <div className='px-4 py-2 bg-p-brand text-white'>
            <h3>ID：{inquiryDetail.id}</h3>
            <h5>カテゴリー：{inquiryDetail.categoryName}</h5>
            投稿時間：{inquiryDetail.createdAt}
          </div>
          <div className='p-4'>{inquiryDetail.content}</div>
          <div className='p-4 border-t border-p-mid'>
            <div>
              <form action={`/admin/inquiry/detail/check/${inquiryDetail.id}`} method='post'>
                <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                <input
                  type='checkbox'
                  name='inquiry[is_check]'
                  id='check'
                  value='1'
                  className='mr-2'
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <label htmlFor='check'>
                  対応チェック
                </label>
                <div className='text-right'>
                  <button type='submit' className='px-5 py-2 bg-[#f0ad4e] text-black rounded hover:opacity-80 text-lg'>
                    更新
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
