'use client';

// web/app/user/password_forgot/page.tsx
//
// パスワード再設定のメールを送る画面。Rails の UserController#password_forgot / email_exist を置き換える。
// 送信は POST /api/v1/password_resets。登録の有無にかかわらず同じ応答なので、成功したら
// Rails と同じ文言を出してトップへ。空欄・回数超過はこの画面に理由を出す。

import { api } from '@sucseed/api';
import { type Flash, FlashMessages, pushFlash } from '@sucseed/ui';
import { type FormEvent, useState } from 'react';

// Rails の t('flash.success.password_reset_sent') と同じ文言
const SENT = 'パスワードリセット用のメールを送信しました（登録済みの場合）';

export default function PasswordForgotPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [flash, setFlash] = useState<Flash>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setFlash({});
    const result = await api.passwordResets.create(email);
    if (result.ok) {
      pushFlash('success', SENT);
      window.location.assign('/index');
      return;
    }
    setSending(false);
    setFlash({ danger: result.error.message });
  };

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
        メールアドレス確認
      </h1>

      <FlashMessages flash={flash} />

      <div className="w-[90%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]">
        <form onSubmit={submit}>
          <div className="mb-4">
            <label className="block mb-1 text-p-text" htmlFor="password-forgot-email">
              メールアドレス
            </label>
            <input
              type="email"
              id="password-forgot-email"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
              placeholder="メールアドレス"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-white hover:opacity-80"
              disabled={sending}
            >
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
