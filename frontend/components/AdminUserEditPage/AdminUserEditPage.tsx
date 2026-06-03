// frontend/components/AdminUserEditPage/AdminUserEditPage.tsx
//
// /admin/management/user ページの React コンポーネント。
// ユーザー一覧テーブル + 編集/削除ボタン。
//
// 【data-props】
//   users: [{ id, name, avatarPath, profile, createdAt, deletedAt, loginTime }]

import { getCsrfToken } from '../../utils/csrf';
import { AdminSideMenu } from '../AdminSideMenu';
import { FlashMessages } from '../FlashMessages';

interface AdminUser {
  id: number;
  name: string;
  avatarPath: string;
  profile: string;
  createdAt: string;
  deletedAt: string | null;
  loginTime: string | null;
}

interface Props {
  users: AdminUser[];
  flash: Record<string, string>;
}

export const AdminUserEditPage = ({ users, flash }: Props) => (
  <div className="w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap">
    <AdminSideMenu activeKey="user" />
    <div className="w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll">
      <h1 className="text-center text-[60px]">ユーザー管理</h1>

      <FlashMessages flash={flash} />
      <table className="w-screen overflow-x-scroll overflow-y-scroll">
        <thead>
          <tr>
            <th scope="col">＃</th>
            <th scope="col">ID</th>
            <th scope="col">名前</th>
            <th scope="col">アバター</th>
            <th scope="col">プロフィール</th>
            <th scope="col">登録日時</th>
            <th scope="col">削除日時</th>
            <th scope="col">最新ログイン時間</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user.id}>
              <th scope="row">{i + 1}</th>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <img
                  src={user.avatarPath}
                  className="rounded-full"
                  width={39}
                  height={39}
                  alt={user.name}
                />
              </td>
              <td>{user.profile}</td>
              <td>{user.createdAt}</td>
              <td>{user.deletedAt ?? ''}</td>
              <td>{user.loginTime ?? ''}</td>
              <td>
                <a
                  href={`/admin/user/edit/${user.id}`}
                  className="px-4 py-2 bg-[#f0ad4e] text-black rounded hover:opacity-80 inline-block"
                >
                  編集
                </a>
              </td>
              <td>
                <form
                  action={`/admin/user/delete/${user.id}`}
                  method="post"
                  onSubmit={(e) => {
                    if (!window.confirm('本当に削除しますか？')) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:opacity-80"
                  >
                    削除
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
