// frontend/components/HeirUpdatePage/HeirUpdatePage.tsx
//
// /heir/edit ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   heir         : 現在の後継者情報 { artCategoryId, introduction }
//   artCategories: ArtCategory 一覧 [{ id, name }]
//   errors       : バリデーションエラー文字列の配列

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface ArtCategory {
  id: number;
  name: string;
}

interface Props {
  heir: {
    artCategoryId: number;
    introduction: string;
  };
  artCategories: ArtCategory[];
  errors: string[];
  flash: Record<string, string>;
}

// ── コンポーネント ───────────────────────────────────────────────────

export const HeirUpdatePage = ({ heir, artCategories, errors, flash }: Props) => {
  const [artCategoryId, setArtCategoryId] = useState(heir.artCategoryId);
  const [introduction, setIntroduction] = useState(heir.introduction);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>後継者情報更新</h1>

      <FlashMessages flash={flash} />

      <div className='w-[90%] mx-auto bg-p-light border border-p-mid rounded-[7px]'>
        {errors.length > 0 && (
          <div id='error_explanation' className='alert alert-danger'>
            <ul>
              {errors.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 編集メニュー */}
        <div className='relative'>
          <button
            type='button'
            className='rounded bg-white border border-gray-300 px-3 py-2 hover:opacity-80'
            id='dropdownMenu1'
            onClick={() => setShowMenu(!showMenu)}
            aria-haspopup='true'
            aria-expanded={showMenu}
          >
            <i className='fas fa-cog text-[50px]' />
          </button>
          <ul
            className={`absolute right-0 z-10 mt-1 w-48 rounded bg-white shadow-lg border border-gray-200${showMenu ? '' : ' hidden'}`}
            aria-labelledby='dropdownMenu1'
          >
            <li>
              <a href='/my_page/my_page' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                プロフィール一覧
              </a>
            </li>
            <li>
              <a href='/my_page/update' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                プロフィール変更
              </a>
            </li>
            <li>
              <a href='/heir/show' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                プロフィール詳細一覧
              </a>
            </li>
            <li>
              <a href='/heir/edit' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                プロフィール詳細変更
              </a>
            </li>
          </ul>
        </div>

        <form action='/heir/update' method='post'>
          <input type='hidden' name='_method' value='patch' />
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />

          <div className='w-[80%] h-screen mt-[7%] mx-auto'>
            <div className='mb-[3%] border border-p-mid rounded overflow-hidden'>
              <div className='px-3 py-2 text-[17px] text-white bg-p-brand'>兴味のある分野</div>
              <div className='bg-white p-3'>
                <div className='form-group'>
                  <select
                    name='heir[art_category_id]'
                    className='w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                    value={artCategoryId}
                    onChange={(e) => setArtCategoryId(Number(e.target.value))}
                  >
                    <option value=''>選択してください</option>
                    {artCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <small className='text-red-500'>必須</small>
                </div>
              </div>
            </div>

            <div className='mb-[3%] border border-p-mid rounded overflow-hidden'>
              <div className='px-3 py-2 text-[17px] text-white bg-p-brand'>
                <label htmlFor='heir_introduction'>自己紹介</label>
              </div>
              <div className='bg-white p-3'>
                <div className='form-group'>
                  <textarea
                    id='heir_introduction'
                    name='heir[introduction]'
                    className='w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                    rows={15}
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className='mt-[1%] mb-[3%] text-right'>
              <button
                type='submit'
                className='rounded bg-p-brand px-5 py-2 text-[23px] text-white hover:opacity-80'
              >
                登録
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
