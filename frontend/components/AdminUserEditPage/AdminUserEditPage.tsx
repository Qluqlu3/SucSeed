// frontend/components/AdminUserEditPage/AdminUserEditPage.tsx
//
// /admin/management/user ページの React コンポーネント。
// ユーザー一覧テーブル + 編集/削除ボタン。
//
// 【data-props】
//   users: [{ id, name, avatarPath, profile, createdAt, deletedAt, loginTime }]

import { AdminSideMenu } from '../AdminSideMenu';
import { getCsrfToken } from '../../utils/csrf';

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
}

export const AdminUserEditPage = ({ users }: Props) => (
  <div className="row admin-row">
    <AdminSideMenu activeKey="user" />
    <div className="col-10 admin-col-9">
      <h1 className="admin-main-title">ユーザー管理</h1>
      <table className="table table-striped">
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
                  className="rounded-circle"
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
                <a href={`/admin/user/edit/${user.id}`} className="btn btn-warning">
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
                  <button type="submit" className="btn btn-danger">
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
