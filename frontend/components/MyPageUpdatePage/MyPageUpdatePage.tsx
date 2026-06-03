// frontend/components/MyPageUpdatePage/MyPageUpdatePage.tsx
//
// /my_page/update ページの React コンポーネント。
// プロフィール更新フォーム。PATCH /my_page/update へ multipart/form-data で送信。

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';

import { FlashMessages } from '../FlashMessages';

interface User {
  name: string;
  email: string;
  profile: string | null;
  avatarPath: string;
}

interface Props {
  user: User;
  errors: string[];
  isCreator: boolean;
  flash: Record<string, string>;
}

export const MyPageUpdatePage = ({ user, errors, isCreator, flash }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
        プロフィール変更
      </h1>

      <FlashMessages flash={flash} />

      {/* フラッシュ・エラー表示は ERB 側で出力済みのため、バリデーションエラー のみ表示 */}
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

      <div className="w-[93%] mx-auto bg-p-light border border-p-mid rounded-[7px] mb-[5%]">
        {/* 設定ドロップダウン */}
        <div className="relative">
          <button
            className="rounded bg-white border border-gray-300 px-3 py-2 hover:opacity-80"
            type="button"
            id="dropdownMenu1"
            onClick={() => setShowMenu(!showMenu)}
            aria-haspopup="true"
            aria-expanded={showMenu}
          >
            <i className="fas fa-cog text-[50px]" />
          </button>
          <ul
            className={`absolute right-0 z-10 mt-1 w-48 rounded bg-white shadow-lg border border-gray-200${showMenu ? '' : ' hidden'}`}
            aria-labelledby="dropdownMenu1"
          >
            <li>
              <a href="/my_page/my_page" className="block px-4 py-2 text-sm hover:bg-gray-100">
                プロフィール一覧
              </a>
            </li>
            <li>
              <a href="/my_page/update" className="block px-4 py-2 text-sm hover:bg-gray-100">
                プロフィール変更
              </a>
            </li>
            {isCreator ? (
              <li>
                <a href="/creator/show" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  プロフィール詳細
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a href="/heir/show" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    プロフィール詳細
                  </a>
                </li>
                <li>
                  <a href="/heir/edit" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    プロフィール詳細変更
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        <form action="/my_page/update" method="post" encType="multipart/form-data">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          {/* Rails の PATCH メソッドオーバーライド */}
          <input type="hidden" name="_method" value="PATCH" />

          {/* アバター */}
          <div className="min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-lg">
            <div className="pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand">
              アバター
            </div>
            <div className="text-[2.3em] py-[2%] bg-white text-center [&_p]:pl-[1%]">
              {user.avatarPath && (
                <img src={user.avatarPath} className="rounded-full inline" alt="アバター画像" />
              )}
              <input
                type="file"
                name="user[avatar_path]"
                className="block mt-2"
                accept="image/jpg,image/jpeg,image/png"
              />
            </div>
          </div>

          {/* ユーザー名 */}
          <div className="min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-lg">
            <div className="pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand">
              ユーザー名
            </div>
            <div className="text-[2.3em] py-[2%] bg-white [&_p]:pl-[1%]">
              <p>{user.name}</p>
              <input
                type="text"
                name="user[name]"
                className="w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                maxLength={50}
                placeholder="ユーザ名"
                defaultValue={user.name}
              />
            </div>
          </div>

          {/* メールアドレス */}
          <div className="min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-lg">
            <div className="pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand">
              メールアドレス
            </div>
            <div className="text-[2.3em] py-[2%] bg-white [&_p]:pl-[1%]">
              <p>{user.email}</p>
              <input
                type="email"
                name="user[email]"
                className="w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                maxLength={50}
                placeholder="メールアドレス"
                defaultValue={user.email}
              />
            </div>
          </div>

          {/* 紹介文 */}
          <div className="min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-lg">
            <div className="pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand">
              紹介文
            </div>
            <div className="text-[2.3em] py-[2%] bg-white [&_p]:pl-[1%]">
              <textarea
                name="user[profile]"
                className="w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                placeholder="紹介文"
                rows={15}
                defaultValue={user.profile ?? ''}
              />
            </div>
          </div>

          <div className="mb-[3%]" />

          <div className="pr-[1%] pb-[2%] text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-white hover:opacity-80"
            >
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
