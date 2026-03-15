// frontend/components/MyPageUpdatePage/MyPageUpdatePage.tsx
//
// /my_page/update ページの React コンポーネント。
// プロフィール更新フォーム。PATCH /my_page/update へ multipart/form-data で送信。

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

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
}

export const MyPageUpdatePage = ({ user, errors, isCreator }: Props) => {
  return (
    <>
      <h1>プロフィール変更</h1>

      {/* フラッシュ・エラー表示は ERB 側で出力済みのため、バリデーションエラーのみ表示 */}
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

      <div className='wrapper'>
        {/* 設定ドロップダウン */}
        <div className='dropdown dropdown-right'>
          <button
            className='btn btn-default dropdown-toggle'
            type='button'
            id='dropdownMenu1'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='true'
          >
            <i className='fas fa-cog setting-icon' />
          </button>
          <ul
            className='dropdown-menu dropdown-menu-right dropdown-box'
            aria-labelledby='dropdownMenu1'
          >
            <li>
              <a href='/my_page/my_page' className='dropdown-item'>
                プロフィール一覧
              </a>
            </li>
            <li>
              <a href='/my_page/update' className='dropdown-item'>
                プロフィール変更
              </a>
            </li>
            {isCreator ? (
              <li>
                <a href='/creator/show' className='dropdown-item'>
                  プロフィール詳細
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a href='/heir/show' className='dropdown-item'>
                    プロフィール詳細
                  </a>
                </li>
                <li>
                  <a href='/heir/edit' className='dropdown-item'>
                    プロフィール詳細変更
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        <form action='/my_page/update' method='post' encType='multipart/form-data'>
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
          {/* Rails の PATCH メソッドオーバーライド */}
          <input type='hidden' name='_method' value='PATCH' />

          {/* アバター */}
          <div className='card out-line'>
            <div className='card-header my-card-header'>アバター</div>
            <div className='card-body my-card-body card-img'>
              {user.avatarPath && (
                <img src={user.avatarPath} className='img-circle' alt='アバター画像' />
              )}
              <input
                type='file'
                name='user[avatar_path]'
                className='form-control-file'
                accept='image/jpg,image/jpeg,image/png'
              />
            </div>
          </div>

          {/* ユーザー名 */}
          <div className='card out-line'>
            <div className='card-header my-card-header'>ユーザー名</div>
            <div className='card-body my-card-body'>
              <p>{user.name}</p>
              <input
                type='text'
                name='user[name]'
                className='form-control update-form-input'
                maxLength={50}
                placeholder='ユーザ名'
                defaultValue={user.name}
              />
            </div>
          </div>

          {/* メールアドレス */}
          <div className='card out-line'>
            <div className='card-header my-card-header'>メールアドレス</div>
            <div className='card-body my-card-body'>
              <p>{user.email}</p>
              <input
                type='email'
                name='user[email]'
                className='form-control update-form-input'
                maxLength={50}
                placeholder='メールアドレス'
                defaultValue={user.email}
              />
            </div>
          </div>

          {/* 紹介文 */}
          <div className='card out-line'>
            <div className='card-header my-card-header'>紹介文</div>
            <div className='card-body my-card-body'>
              <textarea
                name='user[profile]'
                className='form-control update-form-input'
                placeholder='紹介文'
                rows={15}
                defaultValue={user.profile ?? ''}
              />
            </div>
          </div>

          <div className='bottom-box' />

          <div className='text-right profile-update-btn-box'>
            <button type='submit' className='btn btn-lg profile-update-btn'>
              変更
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
