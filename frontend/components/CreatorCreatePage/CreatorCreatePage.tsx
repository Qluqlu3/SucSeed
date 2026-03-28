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

// ── 型定義 ──────────────────────────────────────────────────────────
interface ArtCategory {
  id: number;
  name: string;
}

interface Props {
  artCategories: ArtCategory[];
  errors: string[];
}

// ── コンポーネント ───────────────────────────────────────────────────

export const CreatorCreatePage = ({ artCategories, errors }: Props) => {
  const [title, setTitle] = useState('');
  const [artCategoryId, setArtCategoryId] = useState<number | ''>('');
  const [establishment, setEstablishment] = useState<number | ''>('');
  const [employee, setEmployee] = useState<number | ''>('');
  const [postalCode, setPostalCode] = useState('');
  const [isRecruitment, setIsRecruitment] = useState(true);

  return (
    <div>
      <h1 className='main-title'>制作者情報</h1>
      <div className='all-cover-box'>
        <div className='wrapper'>
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

            <div className='form-group row form-box'>
              <div className='col-lg-2 left-col'>
                <label htmlFor='creator_title' className='form-input-label'>
                  制作工芸名
                </label>
              </div>
              <div className='col-xl-10'>
                <input
                  id='creator_title'
                  type='text'
                  name='creator[title]'
                  className='form-control'
                  placeholder='制作工芸名'
                  maxLength={30}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <small className='form-text small-text'>必須 30文字以内</small>
              </div>
            </div>

            <div className='form-group row form-box'>
              <div className='col-lg-2 left-col'>
                <label htmlFor='creator_art_category_id' className='form-input-label'>
                  工芸カテゴリ
                </label>
              </div>
              <div className='col-10'>
                <select
                  id='creator_art_category_id'
                  name='creator[art_category_id]'
                  className='form-control'
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
                <small className='form-text small-text'>必須　選択</small>
              </div>
            </div>

            <div className='form-group row form-box'>
              <div className='col-lg-2 left-col'>
                <label htmlFor='creator_establishment' className='form-input-label'>
                  創業年数
                </label>
              </div>
              <div className='col-xl-10'>
                <input
                  id='creator_establishment'
                  type='number'
                  name='creator[establishment]'
                  className='form-control'
                  placeholder='創業年数'
                  min={0}
                  max={500}
                  maxLength={3}
                  value={establishment}
                  onChange={(e) =>
                    setEstablishment(e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
                <small className='form-text small-text'>必須</small>
              </div>
            </div>

            <div className='form-group row form-box'>
              <div className='col-lg-2 left-col'>
                <label htmlFor='creator_employee' className='form-input-label'>
                  従業員数
                </label>
              </div>
              <div className='col-xl-10'>
                <input
                  id='creator_employee'
                  type='number'
                  name='creator[employee]'
                  className='form-control'
                  placeholder='従業員数'
                  min={0}
                  max={500}
                  maxLength={3}
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value === '' ? '' : Number(e.target.value))}
                />
                <small className='form-text small-text'>必須</small>
              </div>
            </div>

            <div className='form-group row form-box'>
              <div className='col-lg-2 left-col'>
                <label htmlFor='creator_postal_code' className='form-input-label'>
                  作業所郵便番号
                </label>
              </div>
              <div className='col-10'>
                <input
                  id='creator_postal_code'
                  type='text'
                  name='creator[postal_code]'
                  className='form-control'
                  placeholder='作業所郵便番号'
                  maxLength={7}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <small className='form-text small-text'>必須　半角数字ハイフンなし7文字</small>
              </div>
            </div>

            <div className='form-group row form-box'>
              <div className='col-lg-2 left-col'>募集チェック</div>
              <div className='col-xl-10'>
                <input
                  id='creator_is_recruitment'
                  type='checkbox'
                  name='creator[is_recruitment]'
                  className='form-check-input my-check-box'
                  value='1'
                  checked={isRecruitment}
                  onChange={(e) => setIsRecruitment(e.target.checked)}
                />
                {/* チェックなし時に "0" を送信するための hidden */}
                <input type='hidden' name='creator[is_recruitment]' value='0' />
                <label htmlFor='creator_is_recruitment' className='form-check-label my-check-label'>
                  後継者を募集中
                </label>
                <small className='form-text small-text'>必須　募集している場合はチェック</small>
              </div>
            </div>

            <div className='text-right my-submit-box'>
              <button type='submit' className='btn btn-default my-regist-btn'>
                登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
