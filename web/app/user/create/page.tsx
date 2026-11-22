'use client';

// web/app/user/create/page.tsx
//
// 会員登録。Rails の UserController#regist / create を置き換える。
// 送信は POST /api/v1/registration（アバター画像を付けられるよう multipart）。
// 成功したら Rails と同じく「登録完了。認証メールを送信しました。」を出してトップへ。
// 失敗したら入力を残してエラーを並べる（Rails 版は入力をすべて捨てていた）。

import { api } from '@sucseed/api';
import { type Flash, FlashMessages, pushFlash } from '@sucseed/ui';
import { type FormEvent, type ReactNode, useState } from 'react';
import { FormErrors } from '../../_components/FormErrors';

// Rails の t('flash.success.register') と同じ文言
const REGISTERED = '登録完了。認証メールを送信しました。';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => 1930 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
const pad2 = (value: number) => String(value).padStart(2, '0');

const inputClass =
  'w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none';
const selectClass =
  'rounded border border-gray-300 px-2 py-1 focus:border-p-brand focus:outline-none';

const Row = ({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) => (
  <div className="flex my-[2.7%]">
    <div className="w-1/6 shrink-0">
      {htmlFor ? (
        <label className="text-p-text text-[17px] pt-[2.9%]" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <p className="text-p-text text-[17px] pt-[2.9%]">{label}</p>
      )}
    </div>
    <div className="flex-1">
      {children}
      {hint && (
        <div>
          <small className="text-p-muted text-[13px] m-0 p-0">{hint}</small>
        </div>
      )}
    </div>
  </div>
);

const RadioPair = ({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  options: [{ id: string; label: string }, { id: string; label: string }];
}) => (
  <>
    {options.map((option, index) => {
      // 1つ目が true、2つ目が false
      const optionValue = index === 0;
      return (
        <div key={option.id} className="inline-flex items-center mr-4">
          <input
            type="radio"
            name={name}
            id={option.id}
            className="mr-1"
            checked={value === optionValue}
            onChange={() => onChange(optionValue)}
          />
          <label className="text-p-text text-[17px]" htmlFor={option.id}>
            {option.label}
          </label>
        </div>
      );
    })}
  </>
);

export default function UserCreatePage() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isMan, setIsMan] = useState(true);
  const [year, setYear] = useState(1989);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [email, setEmail] = useState('');
  const [isCreator, setIsCreator] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>({});
  const [errors, setErrors] = useState<string[]>([]);

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);

  // 年・月を変えてその月に無い日になったら月末に寄せる（2月30日などを送らない）
  const changeYearMonth = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setDay((current) => Math.min(current, daysInMonth(newYear, newMonth)));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFlash({});
    setErrors([]);
    const result = await api.registration.create(
      {
        name,
        email,
        birthday: `${year}-${pad2(month)}-${pad2(day)}`,
        isMan,
        isCreator,
        password,
        passwordConfirmation,
      },
      avatar,
    );
    if (result.ok) {
      pushFlash('success', REGISTERED);
      // トップはまだ Rails の画面なので通常の遷移にする
      window.location.assign('/index');
      return;
    }
    setSaving(false);
    if (result.error.code === 'unprocessable_entity') {
      setErrors(result.error.details);
    } else {
      setFlash({ danger: result.error.message });
    }
  };

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">ユーザ登録</h1>

      <FlashMessages flash={flash} />

      <div className="min-h-screen">
        <div className="min-h-[65vh] w-[90%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]">
          <FormErrors errors={errors} />

          <form onSubmit={submit}>
            <Row label="ユーザー名" htmlFor="user-name" hint="必須 50文字以内">
              <input
                type="text"
                id="user-name"
                className={inputClass}
                maxLength={50}
                placeholder="ユーザー名"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Row>

            <Row label="アバター" htmlFor="user-avatar">
              <input
                type="file"
                id="user-avatar"
                className="block text-p-text"
                accept="image/jpg,image/jpeg,image/png"
                onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
              />
            </Row>

            <Row label="性別" hint="必須">
              <RadioPair
                name="is_man"
                value={isMan}
                onChange={setIsMan}
                options={[
                  { id: 'radio-man', label: '男性' },
                  { id: 'radio-woman', label: '女性' },
                ]}
              />
            </Row>

            <Row label="生年月日" htmlFor="user-birthday-year" hint="必須">
              <div className="text-p-text">
                <select
                  id="user-birthday-year"
                  className={selectClass}
                  value={year}
                  onChange={(event) => changeYearMonth(Number(event.target.value), month)}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>{' '}
                年{' '}
                <select
                  aria-label="月"
                  className={selectClass}
                  value={month}
                  onChange={(event) => changeYearMonth(year, Number(event.target.value))}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>{' '}
                月{' '}
                <select
                  aria-label="日"
                  className={selectClass}
                  value={day}
                  onChange={(event) => setDay(Number(event.target.value))}
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>{' '}
                日
              </div>
            </Row>

            <Row label="メールアドレス" htmlFor="user-email" hint="必須 半角英数">
              <input
                type="email"
                id="user-email"
                className={inputClass}
                placeholder="メールアドレス"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Row>

            <Row label="ユーザー種別" hint="必須">
              <RadioPair
                name="is_creator"
                value={isCreator}
                onChange={setIsCreator}
                options={[
                  { id: 'radio-creator', label: '職人' },
                  { id: 'radio-heir', label: '後継検討' },
                ]}
              />
            </Row>

            <Row
              label="パスワード"
              htmlFor="user-password"
              hint="必須　半角英数 8文字以上 16文字以内"
            >
              <input
                type="password"
                id="user-password"
                className={inputClass}
                maxLength={16}
                placeholder="パスワード"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Row>

            <Row label="パスワード確認" htmlFor="user-password-confirmation" hint="必須　確認入力">
              <input
                type="password"
                id="user-password-confirmation"
                className={inputClass}
                maxLength={16}
                placeholder="パスワード確認"
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
              />
            </Row>

            <div className="text-right mt-[3.9%]">
              <button
                type="submit"
                className="rounded bg-p-brand px-5 py-2 text-[1.3em] text-white hover:opacity-80 mr-[1%]"
                disabled={saving}
              >
                新規登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
