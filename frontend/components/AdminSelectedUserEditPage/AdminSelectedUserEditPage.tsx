// frontend/components/AdminSelectedUserEditPage/AdminSelectedUserEditPage.tsx
//
// /admin/user/edit/:id ページの React コンポーネント。
// アバター画像変更 + プロフィール編集フォーム。PATCH /admin/user/edit/:id。
//
// 【data-props】
//   user: { id, avatarPath, profile }

import { AdminSideMenu } from '../AdminSideMenu';

interface Props {
  user: {
    id: number;
    avatarPath: string;
    profile: string;
  };
}

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

export const AdminSelectedUserEditPage = ({ user }: Props) => (
  <div className='row admin-row'>
    <AdminSideMenu />
    <div className='col-10 admin-col-9'>
      <h1 className='admin-main-title'>ユーザー編集</h1>
      <form
        action={`/admin/user/edit/${user.id}`}
        method='post'
        encType='multipart/form-data'
        onSubmit={(e) => {
          if (!window.confirm('変更しますか？')) e.preventDefault();
        }}
      >
        <input type='hidden' name='_method' value='patch' />
        <input type='hidden' name='authenticity_token' value={getCsrfToken()} />

        {/* アバター */}
        <div className='card'>
          <div className='card-body'>
            <img
              src={user.avatarPath}
              className='img-circle'
              alt='アバター画像'
              style={{ width: '100%', height: '100%' }}
            />
            <input
              type='file'
              name='user[avatar_path]'
              className='form-control-file'
              id='exampleFormControlFile1'
              accept='image/jpg,image/jpeg,image/png'
            />
          </div>
        </div>

        {/* プロフィール */}
        <div className='card'>
          <div className='card-body'>
            <textarea
              name='user[profile]'
              className='form-control'
              placeholder='紹介文'
              rows={15}
              cols={20}
              defaultValue={user.profile}
            />
          </div>
        </div>

        {/* 送信 */}
        <div className='card text-right'>
          <div className='card-body'>
            <button type='submit' className='btn btn-warning btn-lg'>
              変更
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);
