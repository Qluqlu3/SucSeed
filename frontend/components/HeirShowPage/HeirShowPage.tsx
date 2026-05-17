// frontend/components/HeirShowPage/HeirShowPage.tsx
//
// /heir/show（登録済み参照）ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   heir : { artCategoryName, introduction }

import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface Props {
  heir: {
    artCategoryName: string;
    introduction: string;
  };
  flash: Record<string, string>;
}

// ── コンポーネント ───────────────────────────────────────────────────

export const HeirShowPage = ({ heir, flash }: Props) => (
  <div>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>後継者情報参照</h1>

    <FlashMessages flash={flash} />

    <div className='w-[90%] mx-auto bg-p-light border border-p-mid rounded-[7px]'>
      {/* 編集メニュー */}
      <div className='dropdown dropdown-right'>
        <button
          type='button'
          className='btn btn-default dropdown-toggle'
          id='dropdownMenu1'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='true'
        >
          <i className='fas fa-cog text-[50px]' />
        </button>
        <ul className='dropdown-menu dropdown-menu-right' aria-labelledby='dropdownMenu1'>
          <li>
            <a href='/my_page/my_page' className='dropdown-item'>
              プロフィール一覧
            </a>
          </li>
          <li>
            <a href='/my_page/update' className='dropdown-item'>
              プロフィール変更
            </a>
          </li>
          <li>
            <a href='/heir/show' className='dropdown-item'>
              プロフィール詳細一覧
            </a>
          </li>
          <li>
            <a href='/heir/edit' className='dropdown-item'>
              プロフィール詳細変更
            </a>
          </li>
        </ul>
      </div>

      <div className='w-[80%] h-screen mt-[7%] mx-auto'>
        <div className='mb-[3%] border border-p-mid rounded overflow-hidden'>
          <div className='px-3 py-2 text-[17px] text-white bg-p-brand'>兴味のある分野</div>
          <div className='bg-white p-3'>
            <p className='text-[19px]'>{heir.artCategoryName}</p>
          </div>
        </div>

        <div className='mb-[3%] border border-p-mid rounded overflow-hidden'>
          <div className='px-3 py-2 text-[17px] text-white bg-p-brand'>自己紹介</div>
          <div className='bg-white p-3'>
            <p className='text-[19px]'>{heir.introduction}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
