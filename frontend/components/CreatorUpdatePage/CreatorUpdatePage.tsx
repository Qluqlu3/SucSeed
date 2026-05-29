// frontend/components/CreatorUpdatePage/CreatorUpdatePage.tsx
//
// /creator/edit ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   creator      : 現在の職人情報
//   artCategories: ArtCategory 一覧
//   isCreator    : 職人セッションかどうか（設定ドロップダウンの出し分け）
//   errors       : バリデーションエラー文字列の配列

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface ArtCategory {
  id: number;
  name: string;
}

interface CreatorDetail {
  title: string;
  artCategoryId: number;
  categoryName: string;
  establishment: number;
  employee: number;
  postalCode: string;
  isRecruitment: boolean;
}

interface Props {
  creator: CreatorDetail;
  artCategories: ArtCategory[];
  isCreator: boolean;
  errors: string[];
  flash: Record<string, string>;
}

// ── コンポーネント ──────────────────────────────────────────────────────────

export const CreatorUpdatePage = ({ creator, artCategories, isCreator, errors, flash }: Props) => {
  const [title, setTitle] = useState(creator.title);
  const [artCategoryId, setArtCategoryId] = useState(creator.artCategoryId);
  const [establishment, setEstablishment] = useState(creator.establishment);
  const [employee, setEmployee] = useState(creator.employee);
  const [postalCode, setPostalCode] = useState(creator.postalCode);
  const [isRecruitment, setIsRecruitment] = useState(creator.isRecruitment);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      {errors.length > 0 && (
        <div id='error_explanation' className='error-box'>
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

      <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>制作者情報</h1>

      <div className='w-[85%] mx-auto mb-[5%] bg-p-light border border-p-mid rounded-[7px]'>
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
            <li className='setting-item'>
              <a href='/my_page/my_page' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                プロフィール一覧
              </a>
            </li>
            <li className='setting-item'>
              <a href='/my_page/update' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                プロフィール変更
              </a>
            </li>
            {isCreator ? (
              <>
                <li className='setting-item'>
                  <a href='/creator/show' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                    プロフィール詳細
                  </a>
                </li>
                <li className='setting-item'>
                  <a href='/creator/edit' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                    プロフィール詳細変更
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className='setting-item'>
                  <a href='/heir/show' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                    プロフィール詳細
                  </a>
                </li>
                <li className='setting-item'>
                  <a href='/heir/edit' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                    プロフィール詳細変更
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        <form action='/creator/edit' method='post'>
          <input type='hidden' name='_method' value='patch' />
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />

          <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg'>
            <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
              <label htmlFor='art_category_title'>制作工芸名</label>
            </div>
            <div className='text-[27px] py-[2%] bg-white'>
              <div className='pl-[2%]'>{creator.title}</div>
              <input
                id='art_category_title'
                type='text'
                name='art_category[title]'
                className='w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                placeholder='制作工芸名'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <small className='pt-0 mt-0 ml-[8%] text-[16px] text-red-600'>必須</small>
            </div>
          </div>

          <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg'>
            <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
              <label htmlFor='art_category_art_category_id'>工芸カテゴリ</label>
            </div>
            <div className='text-[27px] py-[2%] bg-white'>
              <div className='pl-[2%]'>{creator.categoryName}</div>
              <select
                id='art_category_art_category_id'
                name='art_category[art_category_id]'
                className='w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
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
              <small className='pt-0 mt-0 ml-[8%] text-[16px] text-red-600'>必須</small>
            </div>
          </div>

          <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg'>
            <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
              <label htmlFor='art_category_establishment'>創業年数</label>
            </div>
            <div className='text-[27px] py-[2%] bg-white'>
              <div className='pl-[2%]'>{creator.establishment}年</div>
              <input
                id='art_category_establishment'
                type='number'
                name='art_category[establishment]'
                className='w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                placeholder='創業年数'
                value={establishment}
                onChange={(e) => setEstablishment(Number(e.target.value))}
              />
              <small className='pt-0 mt-0 ml-[8%] text-[16px] text-red-600'>必須</small>
            </div>
          </div>

          <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg'>
            <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
              <label htmlFor='art_category_employee'>従業員数</label>
            </div>
            <div className='text-[27px] py-[2%] bg-white'>
              <div className='pl-[2%]'>{creator.employee}人</div>
              <input
                id='art_category_employee'
                type='number'
                name='art_category[employee]'
                className='w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                placeholder='従業員数'
                value={employee}
                onChange={(e) => setEmployee(Number(e.target.value))}
              />
              <small className='pt-0 mt-0 ml-[8%] text-[16px] text-red-600'>必須</small>
            </div>
          </div>

          <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg'>
            <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
              <label htmlFor='art_category_postal_code'>作業所郵便番号</label>
            </div>
            <div className='text-[27px] py-[2%] bg-white'>
              <div className='pl-[2%]'>{creator.postalCode}</div>
              <input
                id='art_category_postal_code'
                type='text'
                name='art_category[postal_code]'
                className='w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                placeholder='郵便番号'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <small className='pt-0 mt-0 ml-[8%] text-[16px] text-red-600'>必須</small>
            </div>
          </div>

          <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg'>
            <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
              <label htmlFor='art_category_is_recruitment'>募集チェック</label>
            </div>
            <div className='text-[27px] py-[2%] bg-white pl-[5%]'>
              <input
                id='art_category_is_recruitment'
                type='checkbox'
                name='art_category[is_recruitment]'
                className='form-check-input transform-[scale(1.7,1.7)]'
                value='1'
                checked={isRecruitment}
                onChange={(e) => setIsRecruitment(e.target.checked)}
              />
              {/* チェックなし時に "0" を送信するための hidden */}
              <input type='hidden' name='art_category[is_recruitment]' value='0' />
              <label htmlFor='art_category_is_recruitment' className='form-check-label'>
                後継者を募集中
              </label>
            </div>
          </div>

          <div className='text-right mt-[3%] mr-[4%]'>
            <button type='submit' className='rounded bg-p-brand px-5 py-2 text-[23px] text-white hover:opacity-80'>
              変更
            </button>
          </div>

          <div className='pb-[5%] mb-[7%]' />
        </form>
      </div>
    </div>
  );
};
