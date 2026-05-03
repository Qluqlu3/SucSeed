// frontend/components/InquiryInputPage/InquiryInputPage.tsx
//
// /inquiry/input ページ全体の React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   categories  : InquiryCategory 一覧 [{ id, name }]
//   errors      : バリデーションエラー文字列の配列（再レンダリング時）
//   prevValues  : 送信失敗時の入力値の復元用 { inquiryCategoryId, content }

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  errors: string[];
  prevValues: {
    inquiryCategoryId: number | '';
    content: string;
  };
  flash: Record<string, string>;
}

// ── コンポーネント ───────────────────────────────────────────────────

export const InquiryInputPage = ({ categories, errors, prevValues, flash }: Props) => {
  const [categoryId, setCategoryId] = useState<number | ''>(prevValues.inquiryCategoryId);
  const [content, setContent] = useState(prevValues.content);

  return (
    <div>
      <h1 className='main-title'>お問い合わせ</h1>

      <FlashMessages flash={flash} />

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

          <form action='/inquiry/input' method='post'>
            <input type='hidden' name='_method' value='post' />
            <input type='hidden' name='authenticity_token' value={getCsrfToken()} />

            <div className='form-group'>
              {/* biome-ignore lint/a11y/noLabelWithoutControl: select は直後に配置 */}
              <label className='col-xl-12 inquiry-input-label'>カテゴリー</label>
              <select
                name='inquiry[inquiry_category_id]'
                className='col-xl-12 form-control'
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value=''>選択してください</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group my-form-inquiry'>
              {/* biome-ignore lint/a11y/noLabelWithoutControl: textarea は直後に配置 */}
              <label className='col-xl-12 inquiry-input-label'>お問い合わせ内容</label>
              <textarea
                name='inquiry[content]'
                className='col-xl-12 form-control input-inquiry'
                rows={5}
                placeholder='お問い合わせ内容'
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className='text-right'>
              <button type='submit' className='btn btn-lg inquiry-form-btn'>
                送信
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
