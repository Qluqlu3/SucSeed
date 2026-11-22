'use client';

// web/app/user/password_reset/[token]/page.tsx
//
// 新しいパスワードを決める画面（再設定メールのリンク先）。Rails の UserController#password_edit /
// password_reset を置き換える。リンクの確認は GET、変更は PATCH /api/v1/password_resets/:token。
// リンクが無効・期限切れなら Rails と同じく理由を出してメール送信の画面へ戻す。

import { api } from '@sucseed/api';
import { type Flash, FlashMessages, pushFlash } from '@sucseed/ui';
import { useParams } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { useResource } from '../../../../lib/resource';
import { FormErrors } from '../../../_components/FormErrors';

// Rails の t('flash.success.password_changed') / t('flash.danger.error') と同じ文言
const CHANGED = 'パスワードを変更しました。';
const FAILED = 'エラーが発生しました';

const inputClass =
  'w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none';

/** リンクが無効なときの遷移。メッセージは API の error.message（Rails の flash と同じ文言） */
const backToForgot = (message: string) => {
  pushFlash('danger', message);
  window.location.replace('/user/password_forgot');
};

export default function PasswordResetPage() {
  // useParams は URL のままの（パーセントエンコードされた）値を返す。トークンには = が含まれ、
  // メールのリンクでは %3D になっていることがあるので、戻してから API へ渡す（渡すときに改めてエンコードする）
  const token = decodeURIComponent(useParams<{ token: string }>().token);
  const link = useResource(token, api.passwordResets.show);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>({});
  const [errors, setErrors] = useState<string[]>([]);

  const invalidLink =
    link.status === 'error' && link.code === 'invalid_token' ? link.message : null;
  useEffect(() => {
    if (invalidLink !== null) {
      backToForgot(invalidLink);
    }
  }, [invalidLink]);

  if (link.status === 'loading' || invalidLink !== null) {
    return null;
  }

  if (link.status !== 'loaded') {
    return <FlashMessages flash={{ danger: link.status === 'error' ? link.message : FAILED }} />;
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFlash({});
    setErrors([]);
    const result = await api.passwordResets.update(token, password, passwordConfirmation);
    if (result.ok) {
      pushFlash('success', CHANGED);
      window.location.assign('/index');
      return;
    }
    setSaving(false);
    if (result.error.code === 'invalid_token') {
      backToForgot(result.error.message);
      return;
    }
    setFlash({
      danger: result.error.code === 'unprocessable_entity' ? FAILED : result.error.message,
    });
    setErrors(result.error.details);
  };

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">パスワード変更</h1>

      <FlashMessages flash={flash} />

      <div className="w-[90%] mx-auto mb-[5%] p-[3%] bg-p-light border border-p-mid rounded-[7px]">
        <FormErrors errors={errors} />

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="mb-1 block text-sm text-p-text" htmlFor="reset-password">
              パスワード
            </label>
            <input
              type="password"
              id="reset-password"
              className={inputClass}
              maxLength={16}
              placeholder="パスワード"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-sm text-p-text" htmlFor="reset-password-confirmation">
              パスワード確認
            </label>
            <input
              type="password"
              id="reset-password-confirmation"
              className={inputClass}
              maxLength={16}
              placeholder="パスワード確認"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-lg text-white hover:opacity-80"
              disabled={saving}
            >
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
