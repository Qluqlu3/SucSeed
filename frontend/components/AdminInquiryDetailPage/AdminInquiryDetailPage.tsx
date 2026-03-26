// frontend/components/AdminInquiryDetailPage/AdminInquiryDetailPage.tsx
//
// /admin/inquiry/detail/:id ページの React コンポーネント。
// 問い合わせ詳細カード + 対応チェックフォーム。
//
// 【data-props】
//   inquiryDetail: { id, categoryName, content, createdAt }
//   isCheck: boolean

import { useState } from 'react';

interface Props {
  inquiryDetail: {
    id: number;
    categoryName: string;
    content: string;
    createdAt: string;
  };
  isCheck: boolean;
}

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

export const AdminInquiryDetailPage = ({ inquiryDetail, isCheck }: Props) => {
  const [checked, setChecked] = useState(isCheck);

  return (
    <div className='row admin-row'>
      <div className='col-2 admin-col-2'>
        {/* サイドメニューはアクティブ項目なし（詳細ページ） */}
        <ul className='nav flex-column admin-side-menu'>
          <li className='nav-item admin-top-link'>
            <a href='/admin/management/user' className='nav-link'>
              ユーザー管理
            </a>
          </li>
          <li className='nav-item'>
            <a href='/admin/management/diary' className='nav-link'>
              日記管理
            </a>
          </li>
          <li className='nav-item'>
            <a href='/admin/management/diary_comment' className='nav-link'>
              日記コメント
            </a>
          </li>
          <li className='nav-item'>
            <a href='/admin/management/gallery' className='nav-link'>
              ギャラリー管理
            </a>
          </li>
          <li className='nav-item'>
            <a href='/admin/management/inquiry' className='nav-link'>
              問い合わせ管理
            </a>
          </li>
        </ul>
      </div>
      <div className='col-10 admin-col-9'>
        <h1 className='admin-main-title'>ユーザー編集</h1>
        <div className='card'>
          <div className='card-header'>
            <h3>ID：{inquiryDetail.id}</h3>
            <h5>カテゴリー：{inquiryDetail.categoryName}</h5>
            投稿時間：{inquiryDetail.createdAt}
          </div>
          <div className='card-body'>{inquiryDetail.content}</div>
          <div className='card-footer'>
            <div className='form-check'>
              <form action={`/admin/inquiry/detail/check/${inquiryDetail.id}`} method='post'>
                <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                <input
                  type='checkbox'
                  name='inquiry[is_check]'
                  id='check'
                  value='1'
                  className='form-check-input'
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <label htmlFor='check' className='form-check-label'>
                  対応チェック
                </label>
                <div className='text-right'>
                  <button type='submit' className='btn btn-warning btn-lg'>
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
