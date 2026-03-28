// frontend/components/HeirCreatePage/HeirCreatePage.tsx
//
// /heir/show（初回未登録時）ページの React コンポーネント。
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

export const HeirCreatePage = ({ artCategories, errors }: Props) => {
  const [artCategoryId, setArtCategoryId] = useState<number | ''>('');
  const [introduction, setIntroduction] = useState('');

  return (
    <div>
      <h1 className='main-title'>後継者情報</h1>
      <div className='wrapper'>
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
        <div className='dropdown dropdown-right'>
          <button
            type='button'
            className='btn btn-default dropdown-toggle'
            id='dropdownMenu1'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='true'
          >
            <i className='fas fa-cog setting-icon' />
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

        <form action='/heir/create' method='post'>
          <input type='hidden' name='_method' value='post' />
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />

          <div className='my-card-box'>
            <div className='card my-card'>
              <div className='card-header my-card-header'>興味のある分野</div>
              <div className='card-body my-card-body'>
                <div className='form-group'>
                  <select
                    name='heir[art_category_id]'
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
                  <small className='form-text'>必須</small>
                </div>
              </div>
            </div>

            <div className='card my-card'>
              <div className='card-header my-card-header'>
                <label htmlFor='heir_introduction'>自己紹介</label>
              </div>
              <div className='card-body my-card-body'>
                <div className='form-group'>
                  <textarea
                    id='heir_introduction'
                    name='heir[introduction]'
                    className='form-control'
                    rows={15}
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className='right-btn'>
              <button type='submit' className='btn btn-lg my-submit'>
                登録
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
