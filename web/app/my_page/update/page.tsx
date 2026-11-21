'use client';

// web/app/my_page/update/page.tsx
//
// プロフィール変更。Rails の MyPageController#show / update を置き換える。
// 今の値は GET /api/v1/profile、変更は PATCH /api/v1/profile に multipart でまとめて送る
// （Rails 版のフォームと同じくアバター画像も一緒に送れる）。
// 成功したら Rails と同じく「保存しました」を出してマイページへ、失敗したら入力を残してエラーを並べる。

import { api, type Profile } from '@sucseed/api';
import { type Flash, FlashMessages, pushFlash } from '@sucseed/ui';
import { type FormEvent, useState } from 'react';
import { isAuthError, redirectToLogin, useRequireLogin } from '../../../lib/session';
import { useCurrentUser } from '../../../lib/users';
import { ProfileField } from '../_components/ProfileField';
import { ProfileMenu } from '../_components/ProfileMenu';

// Rails の flash（t('flash.success.saved') / t('flash.danger.error')）と同じ文言
const SAVED = '保存しました';
const FAILED = 'エラーが発生しました';

const inputClass =
  'w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none';

const ProfileForm = ({ user, onSaved }: { user: Profile; onSaved: () => void }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profile, setProfile] = useState(user.profile ?? '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>({});
  const [errors, setErrors] = useState<string[]>([]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFlash({});
    setErrors([]);
    const result = await api.profile.updateWithAvatar({ name, email, profile }, avatar);
    if (result.ok) {
      onSaved();
      return;
    }
    setSaving(false);
    if (isAuthError(result.error)) {
      redirectToLogin();
      return;
    }
    setFlash({ danger: FAILED });
    setErrors(result.error.details);
  };

  return (
    <>
      <FlashMessages flash={flash} />

      {errors.length > 0 && (
        <div id="error_explanation" className="error-box">
          <p className="error-title">入力内容にエラーが{errors.length}件あります</p>
          <ul>
            {errors.map((message) => (
              <li key={message} className="error-content">
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-[93%] mx-auto bg-p-light border border-p-mid rounded-[7px] mb-[5%]">
        <ProfileMenu isCreator={user.role === 'creator'} />

        <form onSubmit={submit}>
          <ProfileField title="アバター" centered>
            {/* biome-ignore lint/performance/noImgElement: アップロード画像は Rails から中継して配るので next/image を通さない */}
            <img src={user.avatarPath} className="rounded-full inline" alt="アバター画像" />
            <input
              type="file"
              name="user[avatar_path]"
              className="block mt-2"
              accept="image/jpg,image/jpeg,image/png"
              onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
            />
          </ProfileField>

          <ProfileField title="ユーザー名">
            <p>{user.name}</p>
            <input
              type="text"
              name="user[name]"
              className={inputClass}
              maxLength={50}
              placeholder="ユーザ名"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ProfileField>

          <ProfileField title="メールアドレス">
            <p>{user.email}</p>
            <input
              type="email"
              name="user[email]"
              className={inputClass}
              maxLength={50}
              placeholder="メールアドレス"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </ProfileField>

          <ProfileField title="紹介文">
            <textarea
              name="user[profile]"
              className={inputClass}
              placeholder="紹介文"
              rows={15}
              value={profile}
              onChange={(event) => setProfile(event.target.value)}
            />
          </ProfileField>

          <div className="mb-[3%]" />

          <div className="pr-[1%] pb-[2%] text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-white hover:opacity-80"
              disabled={saving}
            >
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default function MyPageUpdatePage() {
  const loggedIn = useRequireLogin() !== null;
  const user = useCurrentUser(loggedIn);

  if (!loggedIn || user === undefined) {
    return null;
  }

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
        プロフィール変更
      </h1>

      {user === null ? (
        <FlashMessages flash={{ danger: FAILED }} />
      ) : (
        <ProfileForm
          user={user}
          onSaved={() => {
            pushFlash('success', SAVED);
            // マイページは Next の画面だが、積んだ flash を出すため読み込み直す（日記投稿と同じ）
            window.location.assign('/my_page/my_page');
          }}
        />
      )}
    </>
  );
}
