// frontend/components/MyPage/MyPage.tsx
//
// /my_page/my_page ページの React コンポーネント。
// ログインユーザー自身のプロフィール表示。

import { FlashMessages } from '../FlashMessages';

interface User {
  name: string;
  avatarPath: string;
  isMan: boolean;
  email: string;
  birthday: string; // "YYYY-MM-DD"
  profile: string | null;
}

interface Props {
  user: User;
  profileIncomplete: boolean; // true = 詳細情報未登録
  isCreator: boolean;
  flash: Record<string, string>;
}

export const MyPage = ({ user, profileIncomplete, isCreator, flash }: Props) => {
  const birthday = new Date(user.birthday);

  return (
    <>
      <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>プロフィール</h1>

      <FlashMessages flash={flash} />

      <div className='min-h-screen'>
        <div className='w-[93%] mx-auto bg-p-light border border-p-mid rounded-[7px] mb-[5%]'>
          {/* 設定ドロップダウン */}
          <div className='dropdown text-right mb-5'>
            <button
              className='btn btn-default dropdown-toggle'
              type='button'
              id='dropdownMenu1'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='true'
            >
              <i className='fas fa-cog text-[50px]' />
            </button>
            <ul
              className='dropdown-menu dropdown-menu-right dropdown-box'
              aria-labelledby='dropdownMenu1'
            >
              <li className='setting-item'>
                <a href='/my_page/my_page' className='dropdown-item'>
                  プロフィール一覧
                </a>
              </li>
              <li className='setting-item'>
                <a href='/my_page/update' className='dropdown-item'>
                  プロフィール変更
                </a>
              </li>
              {isCreator ? (
                <li className='setting-item'>
                  <a href='/creator/show' className='dropdown-item'>
                    プロフィール詳細
                  </a>
                </li>
              ) : (
                <>
                  <li className='setting-item'>
                    <a href='/heir/show' className='dropdown-item'>
                      プロフィール詳細
                    </a>
                  </li>
                  <li className='setting-item'>
                    <a href='/heir/edit' className='dropdown-item'>
                      プロフィール詳細変更
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* 詳細情報未登録アラート */}
          {profileIncomplete && (
            <div className='px-4 py-3 rounded mb-2 text-xl bg-yellow-100 border border-yellow-400 text-yellow-800'>
              ユーザーの詳細情報登録お願いします。
            </div>
          )}

          {/* アバター */}
          <div className='col-xl-12'>
            <div className='min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-[8px]'>
              <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
                アバター
              </div>
              <div className='text-[2.3em] py-[2%] bg-white text-center [&_p]:pl-[1%]'>
                <img
                  src={user.avatarPath || '/assets/default.png'}
                  className='rounded-circle'
                  width={300}
                  height={300}
                  alt='アバター画像'
                />
              </div>
            </div>
          </div>

          {/* ユーザー名 */}
          <div className='col-xl-12'>
            <div className='min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-[8px]'>
              <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
                ユーザー名
              </div>
              <div className='text-[2.3em] py-[2%] bg-white text-center [&_p]:pl-[1%]'>
                <p>{user.name}</p>
              </div>
            </div>
          </div>

          {/* 性別 */}
          <div className='col-xl-12'>
            <div className='min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-[8px]'>
              <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
                性別
              </div>
              <div className='text-[2.3em] py-[2%] bg-white text-center [&_p]:pl-[1%]'>
                <p>{user.isMan ? '男性' : '女性'}</p>
              </div>
            </div>
          </div>

          {/* メールアドレス */}
          <div className='col-xl-12'>
            <div className='min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-[8px]'>
              <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
                メールアドレス
              </div>
              <div className='text-[2.3em] py-[2%] bg-white text-center [&_p]:pl-[1%]'>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          {/* 生年月日 */}
          <div className='col-xl-12'>
            <div className='min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-[8px]'>
              <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
                生年月日
              </div>
              <div className='text-[2.3em] py-[2%] bg-white text-center [&_p]:pl-[1%]'>
                <p>
                  {birthday.getFullYear()}年{birthday.getMonth() + 1}月{birthday.getDate()}日
                </p>
              </div>
            </div>
          </div>

          {/* 紹介文 */}
          <div className='col-xl-12'>
            <div className='min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-[8px]'>
              <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
                紹介文
              </div>
              <div className='text-[2.3em] py-[2%] bg-white [&_p]:pl-[1%]'>
                <p style={{ whiteSpace: 'pre-wrap' }}>{user.profile}</p>
              </div>
            </div>
          </div>

          <div className='mb-[3%]' />
        </div>
      </div>
    </>
  );
};
