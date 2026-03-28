// frontend/components/UserRegistPage/UserRegistPage.tsx
//
// /user/regist ページの React コンポーネント。
// Rails の @user.errors.full_messages を errors プロップで受け取って表示する。
// フォームは POST /user/create へ multipart/form-data で送信する。

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';

interface Props {
  errors: string[];
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => 1930 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export const UserRegistPage = ({ errors }: Props) => {
  const [year, setYear] = useState(1989);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    if (day > daysInMonth(newYear, month)) setDay(daysInMonth(newYear, month));
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    if (day > daysInMonth(year, newMonth)) setDay(daysInMonth(year, newMonth));
  };

  return (
    <>
      <h1 className='main-title'>ユーザ登録</h1>
      <div className='all-cover-box'>
        <div className='wrapper wrapper1'>
          {errors.length > 0 && (
            <div id='error_explanation' className='error-box'>
              <p className='error-title'>入力内容にエラーが{errors.length}件あります</p>
              <ul>
                {errors.map((msg, i) => (
                  <li key={i} className='error-content'>
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form action='/user/create' method='post' encType='multipart/form-data'>
            <input type='hidden' name='authenticity_token' value={getCsrfToken()} />

            {/* ユーザー名 */}
            <div className='form-group row form-box'>
              <div className='col-lg-2'>
                <label className='form-input-label my-label-text'>ユーザー名</label>
              </div>
              <div className='col-xl-10'>
                <input
                  type='text'
                  name='user[name]'
                  className='form-control form-control-lg'
                  maxLength={50}
                  placeholder='ユーザー名'
                />
                <small className='small-text'>必須 50文字以内</small>
              </div>
            </div>

            {/* アバター */}
            <div className='form-group row form-box'>
              <div className='col-lg-2'>
                <label className='form-input-label my-label-text'>アバター</label>
              </div>
              <div className='col-xl-10'>
                <input
                  type='file'
                  name='user[avatar_path]'
                  className='form-control-file file-text form-control-lg'
                  accept='image/jpg,image/jpeg,image/png'
                />
              </div>
            </div>

            {/* 性別 */}
            <div className='form-group row form-box'>
              <div className='col-lg-2'>
                <p className='my-label-text'>性別</p>
              </div>
              <div className='form-group col-xl-10'>
                <div className='form-check form-check-inline'>
                  <input
                    type='radio'
                    name='user[is_man]'
                    value='1'
                    defaultChecked
                    className='form-check-input form-control-lg'
                    id='radio-man'
                  />
                  <label className='form-check-label radio-text' htmlFor='radio-man'>
                    男性
                  </label>
                </div>
                <div className='form-check form-check-inline'>
                  <input
                    type='radio'
                    name='user[is_man]'
                    value='0'
                    className='form-check-input'
                    id='radio-woman'
                  />
                  <label className='form-check-label radio-text' htmlFor='radio-woman'>
                    女性
                  </label>
                </div>
                <div>
                  <small className='small-text'>必須</small>
                </div>
              </div>
            </div>

            {/* 生年月日 */}
            <div className='form-group birth_date_field row form-box'>
              <div className='col-lg-2'>
                <label className='form-input-label my-label-text'>生年月日</label>
              </div>
              <div className='col-xl-10 date-text'>
                <select
                  name='user[birthday(1i)]'
                  className='form-control'
                  value={year}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>{' '}
                年{' '}
                <select
                  name='user[birthday(2i)]'
                  className='form-control'
                  value={month}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>{' '}
                月{' '}
                <select
                  name='user[birthday(3i)]'
                  className='form-control'
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>{' '}
                日
                <div>
                  <small className='small-text'>必須</small>
                </div>
              </div>
            </div>

            {/* メールアドレス */}
            <div className='form-group row form-box'>
              <div className='col-lg-2'>
                <label className='form-input-label my-label-text'>メールアドレス</label>
              </div>
              <div className='col-xl-10'>
                <input
                  type='email'
                  name='user[email]'
                  className='form-control form-control-lg'
                  placeholder='メールアドレス'
                />
                <small className='small-text'>必須 半角英数</small>
              </div>
            </div>

            {/* ユーザー種別 */}
            <div className='form-group row form-box'>
              <div className='col-lg-2'>
                <p className='my-label-text'>ユーザー種別</p>
              </div>
              <div className='col-xl-10'>
                <div className='form-check form-check-inline'>
                  <input
                    type='radio'
                    name='user[is_creator]'
                    value='1'
                    defaultChecked
                    className='form-check-input'
                    id='radio-creator'
                  />
                  <label className='form-check-label radio-text' htmlFor='radio-creator'>
                    職人
                  </label>
                </div>
                <div className='form-check form-check-inline'>
                  <input
                    type='radio'
                    name='user[is_creator]'
                    value='0'
                    className='form-check-input'
                    id='radio-heir'
                  />
                  <label className='form-check-label radio-text' htmlFor='radio-heir'>
                    後継検討
                  </label>
                </div>
                <div>
                  <small className='small-text'>必須</small>
                </div>
              </div>
            </div>

            {/* パスワード */}
            <div className='form-group row form-box'>
              <div className='col-lg-2'>
                <label className='form-input-label my-label-text'>パスワード</label>
              </div>
              <div className='col-xl-10'>
                <input
                  type='password'
                  name='user[password]'
                  className='form-control form-control-lg'
                  maxLength={16}
                  placeholder='パスワード'
                />
                <small className='small-text'>必須　半角英数 8文字以上 16文字以内</small>
              </div>
            </div>

            {/* パスワード確認 */}
            <div className='form-group row form-box'>
              <div className='col-lg-2'>
                <label className='form-input-label my-label-text'>パスワード確認</label>
              </div>
              <div className='col-xl-10'>
                <input
                  type='password'
                  name='user[password_confirmation]'
                  className='form-control form-control-lg'
                  maxLength={16}
                  placeholder='パスワード確認'
                />
                <small className='small-text'>必須　確認入力</small>
              </div>
            </div>

            <div className='text-right regist-btn-box'>
              <button type='submit' className='btn btn-default regist-btn'>
                新規登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
