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
      <h1>プロフィール</h1>

      <FlashMessages flash={flash} />

      <div className="all-cover-box">
        <div className="wrapper">
          {/* 設定ドロップダウン */}
          <div className="dropdown setting-dropdown">
            <button
              className="btn btn-default dropdown-toggle"
              type="button"
              id="dropdownMenu1"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <i className="fas fa-cog setting-icon" />
            </button>
            <ul
              className="dropdown-menu dropdown-menu-right dropdown-box"
              aria-labelledby="dropdownMenu1"
            >
              <li className="setting-item">
                <a href="/my_page/my_page" className="dropdown-item">
                  プロフィール一覧
                </a>
              </li>
              <li className="setting-item">
                <a href="/my_page/update" className="dropdown-item">
                  プロフィール変更
                </a>
              </li>
              {isCreator ? (
                <li className="setting-item">
                  <a href="/creator/show" className="dropdown-item">
                    プロフィール詳細
                  </a>
                </li>
              ) : (
                <>
                  <li className="setting-item">
                    <a href="/heir/show" className="dropdown-item">
                      プロフィール詳細
                    </a>
                  </li>
                  <li className="setting-item">
                    <a href="/heir/edit" className="dropdown-item">
                      プロフィール詳細変更
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* 詳細情報未登録アラート */}
          {profileIncomplete && (
            <div className="alert alert-warning creator-alert-box">
              ユーザーの詳細情報登録お願いします。
            </div>
          )}

          {/* アバター */}
          <div className="col-xl-12">
            <div className="card out-line">
              <div className="card-header my-card-header">アバター</div>
              <div className="card-body my-card-body card-img">
                <img
                  src={user.avatarPath || '/assets/default.png'}
                  className="rounded-circle"
                  width={300}
                  height={300}
                  alt="アバター画像"
                />
              </div>
            </div>
          </div>

          {/* ユーザー名 */}
          <div className="col-xl-12">
            <div className="card out-line">
              <div className="card-header my-card-header">ユーザー名</div>
              <div className="card-body my-card-body text-center">
                <p>{user.name}</p>
              </div>
            </div>
          </div>

          {/* 性別 */}
          <div className="col-xl-12">
            <div className="card out-line">
              <div className="card-header my-card-header">性別</div>
              <div className="card-body my-card-body text-center">
                <p>{user.isMan ? '男性' : '女性'}</p>
              </div>
            </div>
          </div>

          {/* メールアドレス */}
          <div className="col-xl-12">
            <div className="card out-line">
              <div className="card-header my-card-header">メールアドレス</div>
              <div className="card-body my-card-body text-center">
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          {/* 生年月日 */}
          <div className="col-xl-12">
            <div className="card out-line">
              <div className="card-header my-card-header">生年月日</div>
              <div className="card-body my-card-body text-center">
                <p>
                  {birthday.getFullYear()}年{birthday.getMonth() + 1}月{birthday.getDate()}日
                </p>
              </div>
            </div>
          </div>

          {/* 紹介文 */}
          <div className="col-xl-12">
            <div className="card out-line">
              <div className="card-header my-card-header">紹介文</div>
              <div className="card-body my-card-body">
                <p style={{ whiteSpace: 'pre-wrap' }}>{user.profile}</p>
              </div>
            </div>
          </div>

          <div className="bottom-box" />
        </div>
      </div>
    </>
  );
};
