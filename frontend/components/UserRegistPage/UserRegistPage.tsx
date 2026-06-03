// frontend/components/UserRegistPage/UserRegistPage.tsx
//
// /user/regist ページの React コンポーネント。
// Rails の @user.errors.full_messages を errors プロップで受け取って表示する。
// フォームは POST /user/create へ multipart/form-data で送信する。

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface Props {
  errors: string[];
  flash: Record<string, string>;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => 1930 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export const UserRegistPage = ({ errors, flash }: Props) => {
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
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">ユーザ登録</h1>

      <FlashMessages flash={flash} />

      <div className="min-h-screen">
        <div className="min-h-[65vh] w-[90%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]">
          {errors.length > 0 && (
            <div id="error_explanation" className="error-box">
              <p className="error-title">入力内容にエラーが{errors.length}件あります</p>
              <ul>
                {errors.map((msg) => (
                  <li key={msg} className="error-content">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form action="/user/create" method="post" encType="multipart/form-data">
            <input type="hidden" name="authenticity_token" value={getCsrfToken()} />

            {/* ユーザー名 */}
            <div className="flex my-[2.7%]">
              <div className="w-1/6 shrink-0">
                <label className="text-p-text text-[17px] pt-[2.9%]" htmlFor="user-name">
                  ユーザー名
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  id="user-name"
                  name="user[name]"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                  maxLength={50}
                  placeholder="ユーザー名"
                />
                <small className="text-p-muted text-[13px] m-0 p-0">必須 50文字以内</small>
              </div>
            </div>

            {/* アバター */}
            <div className="flex my-[2.7%]">
              <div className="w-1/6 shrink-0">
                <label className="text-p-text text-[17px] pt-[2.9%]" htmlFor="user-avatar">
                  アバター
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="user-avatar"
                  name="user[avatar_path]"
                  className="block text-p-text"
                  accept="image/jpg,image/jpeg,image/png"
                />
              </div>
            </div>

            {/* 性別 */}
            <div className="flex my-[2.7%]">
              <div className="w-1/6 shrink-0">
                <p className="text-p-text text-[17px] pt-[2.9%]">性別</p>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="user[is_man]"
                    value="1"
                    defaultChecked
                    className="mr-1"
                    id="radio-man"
                  />
                  <label className="text-p-text text-[17px]" htmlFor="radio-man">
                    男性
                  </label>
                </div>
                <div className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="user[is_man]"
                    value="0"
                    className="mr-1"
                    id="radio-woman"
                  />
                  <label className="text-p-text text-[17px]" htmlFor="radio-woman">
                    女性
                  </label>
                </div>
                <div>
                  <small className="text-p-muted text-[13px] m-0 p-0">必須</small>
                </div>
              </div>
            </div>

            {/* 生年月日 */}
            <div className="flex my-[2.7%] birth_date_field">
              <div className="w-1/6 shrink-0">
                <label className="text-p-text text-[17px] pt-[2.9%]" htmlFor="user-birthday-year">
                  生年月日
                </label>
              </div>
              <div className="flex-1 text-p-text">
                <select
                  id="user-birthday-year"
                  name="user[birthday(1i)]"
                  className="rounded border border-gray-300 px-2 py-1 focus:border-p-brand focus:outline-none"
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
                  name="user[birthday(2i)]"
                  className="rounded border border-gray-300 px-2 py-1 focus:border-p-brand focus:outline-none"
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
                  name="user[birthday(3i)]"
                  className="rounded border border-gray-300 px-2 py-1 focus:border-p-brand focus:outline-none"
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
                  <small className="text-p-muted text-[13px] m-0 p-0">必須</small>
                </div>
              </div>
            </div>

            {/* メールアドレス */}
            <div className="flex my-[2.7%]">
              <div className="w-1/6 shrink-0">
                <label className="text-p-text text-[17px] pt-[2.9%]" htmlFor="user-email">
                  メールアドレス
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  id="user-email"
                  name="user[email]"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                  placeholder="メールアドレス"
                />
                <small className="text-p-muted text-[13px] m-0 p-0">必須 半角英数</small>
              </div>
            </div>

            {/* ユーザー種別 */}
            <div className="flex my-[2.7%]">
              <div className="w-1/6 shrink-0">
                <p className="text-p-text text-[17px] pt-[2.9%]">ユーザー種別</p>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="user[is_creator]"
                    value="1"
                    defaultChecked
                    className="mr-1"
                    id="radio-creator"
                  />
                  <label className="text-p-text text-[17px]" htmlFor="radio-creator">
                    職人
                  </label>
                </div>
                <div className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="user[is_creator]"
                    value="0"
                    className="mr-1"
                    id="radio-heir"
                  />
                  <label className="text-p-text text-[17px]" htmlFor="radio-heir">
                    後継検討
                  </label>
                </div>
                <div>
                  <small className="text-p-muted text-[13px] m-0 p-0">必須</small>
                </div>
              </div>
            </div>

            {/* パスワード */}
            <div className="flex my-[2.7%]">
              <div className="w-1/6 shrink-0">
                <label className="text-p-text text-[17px] pt-[2.9%]" htmlFor="user-password">
                  パスワード
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="password"
                  id="user-password"
                  name="user[password]"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                  maxLength={16}
                  placeholder="パスワード"
                />
                <small className="text-p-muted text-[13px] m-0 p-0">
                  必須　半角英数 8文字以上 16文字以内
                </small>
              </div>
            </div>

            {/* パスワード確認 */}
            <div className="flex my-[2.7%]">
              <div className="w-1/6 shrink-0">
                <label
                  className="text-p-text text-[17px] pt-[2.9%]"
                  htmlFor="user-password-confirmation"
                >
                  パスワード確認
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="password"
                  id="user-password-confirmation"
                  name="user[password_confirmation]"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                  maxLength={16}
                  placeholder="パスワード確認"
                />
                <small className="text-p-muted text-[13px] m-0 p-0">必須　確認入力</small>
              </div>
            </div>

            <div className="text-right mt-[3.9%]">
              <button
                type="submit"
                className="rounded bg-p-brand px-5 py-2 text-[1.3em] text-white hover:opacity-80 mr-[1%]"
              >
                新規登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
