// frontend/components/CreatorCreatePage/CreatorCreatePage.tsx
//
// /creator/create ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   artCategories : ArtCategory 一覧 [{ id, name }]
//   errors        : バリデーションエラー文字列の配列

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface ArtCategory {
  id: number;
  name: string;
}

interface Props {
  artCategories: ArtCategory[];
  errors: string[];
  flash: Record<string, string>;
}

// ── コンポーネント ───────────────────────────────────────────────────

export const CreatorCreatePage = ({ artCategories, errors, flash }: Props) => {
  const [title, setTitle] = useState('');
  const [artCategoryId, setArtCategoryId] = useState<number | ''>('');
  const [establishment, setEstablishment] = useState<number | ''>('');
  const [employee, setEmployee] = useState<number | ''>('');
  const [postalCode, setPostalCode] = useState('');
  const [isRecruitment, setIsRecruitment] = useState(true);

  return (
    <div>
      <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>制作者情報</h1>

      <FlashMessages flash={flash} />

      <div className='min-h-screen'>
        <div className='w-[85%] mx-auto mb-[5%] bg-p-light border border-p-mid rounded-[7px]'>
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

          <form action='/creator/create' method='post'>
            <input type='hidden' name='_method' value='post' />
            <input type='hidden' name='authenticity_token' value={getCsrfToken()} />

            <div className='flex my-[2.7%] min-h-[9vh]'>
              <div className='w-1/6 shrink-0 pt-[0.7%] text-[19px] text-p-text'>
                <label htmlFor='creator_title' className='form-input-label'>
                  制作工芸名
                </label>
              </div>
              <div className='flex-1'>
                <input
                  id='creator_title'
                  type='text'
                  name='creator[title]'
                  className='w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                  placeholder='制作工芸名'
                  maxLength={30}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <small className='text-p-muted text-[13px] m-0 p-0'>必須 30文字以内</small>
              </div>
            </div>

            <div className='flex my-[2.7%] min-h-[9vh]'>
              <div className='w-1/6 shrink-0 pt-[0.7%] text-[19px] text-p-text'>
                <label htmlFor='creator_art_category_id' className='form-input-label'>
                  工芸カテゴリ
                </label>
              </div>
              <div className='flex-1'>
                <select
                  id='creator_art_category_id'
                  name='creator[art_category_id]'
                  className='w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                  value={artCategoryId}
                  onChange={(e) =>
                    setArtCategoryId(e.target.value === '' ? '' : Number(e.target.value))
                  }
                >
                  <option value=''>選択してください</option>
                  {artCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <small className='text-p-muted text-[13px] m-0 p-0'>必須　選択</small>
              </div>
            </div>

            <div className='flex my-[2.7%] min-h-[9vh]'>
              <div className='w-1/6 shrink-0 pt-[0.7%] text-[19px] text-p-text'>
                <label htmlFor='creator_establishment' className='form-input-label'>
                  創業年数
                </label>
              </div>
              <div className='flex-1'>
                <input
                  id='creator_establishment'
                  type='number'
                  name='creator[establishment]'
                  className='w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                  placeholder='創業年数'
                  min={0}
                  max={500}
                  maxLength={3}
                  value={establishment}
                  onChange={(e) =>
                    setEstablishment(e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
                <small className='text-p-muted text-[13px] m-0 p-0'>必須</small>
              </div>
            </div>

            <div className='flex my-[2.7%] min-h-[9vh]'>
              <div className='w-1/6 shrink-0 pt-[0.7%] text-[19px] text-p-text'>
                <label htmlFor='creator_employee' className='form-input-label'>
                  従業員数
                </label>
              </div>
              <div className='flex-1'>
                <input
                  id='creator_employee'
                  type='number'
                  name='creator[employee]'
                  className='w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                  placeholder='従業員数'
                  min={0}
                  max={500}
                  maxLength={3}
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value === '' ? '' : Number(e.target.value))}
                />
                <small className='text-p-muted text-[13px] m-0 p-0'>必須</small>
              </div>
            </div>

            <div className='flex my-[2.7%] min-h-[9vh]'>
              <div className='w-1/6 shrink-0 pt-[0.7%] text-[19px] text-p-text'>
                <label htmlFor='creator_postal_code' className='form-input-label'>
                  作業所郵便番号
                </label>
              </div>
              <div className='flex-1'>
                <input
                  id='creator_postal_code'
                  type='text'
                  name='creator[postal_code]'
                  className='w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
                  placeholder='作業所郵便番号'
                  maxLength={7}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <small className='text-p-muted text-[13px] m-0 p-0'>
                  必須　半角数字ハイフンなび7文字
                </small>
              </div>
            </div>

            <div className='flex my-[2.7%] min-h-[9vh]'>
              <div className='w-1/6 shrink-0 pt-[0.7%] text-[19px] text-p-text'>募集チェック</div>
              <div className='flex-1'>
                <input
                  id='creator_is_recruitment'
                  type='checkbox'
                  name='creator[is_recruitment]'
                  className='form-check-input ml-[0.1%]'
                  value='1'
                  checked={isRecruitment}
                  onChange={(e) => setIsRecruitment(e.target.checked)}
                />
                {/* チェックなし時に "0" を送信するための hidden */}
                <input type='hidden' name='creator[is_recruitment]' value='0' />
                <label
                  htmlFor='creator_is_recruitment'
                  className='form-check-label ml-[2%] text-[20px] text-p-text'
                >
                  後継者を募集中
                </label>
                <small className='text-p-muted text-[13px] m-0 p-0'>
                  必須　募集している場合はチェック
                </small>
              </div>
            </div>

            <div className='text-right mt-[5%] mr-[1%] mb-[1%]'>
              <button
                type='submit'
                className='rounded bg-p-brand px-5 py-2 text-[23px] text-white hover:opacity-80'
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
