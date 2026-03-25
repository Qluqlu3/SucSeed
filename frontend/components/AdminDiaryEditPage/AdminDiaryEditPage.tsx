// frontend/components/AdminDiaryEditPage/AdminDiaryEditPage.tsx
//
// /admin/management/diary ページの React コンポーネント。
// 日記一覧テーブル + 削除ボタン。
//
// 【data-props】
//   diaries: [{ id, userId, content, createdAt, deletedAt }]

import { AdminSideMenu } from '../AdminSideMenu';

interface AdminDiary {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  deletedAt: string | null;
}

interface Props {
  diaries: AdminDiary[];
}

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

export const AdminDiaryEditPage = ({ diaries }: Props) => (
  <div className="row admin-row">
    <AdminSideMenu activeKey="diary" />
    <div className="col-10 admin-col-9">
      <h1 className="admin-main-title">日記管理</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">＃</th>
            <th scope="col">ID</th>
            <th scope="col">ユーザーID</th>
            <th scope="col">内容</th>
            <th scope="col">登録日時</th>
            <th scope="col">削除日時</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {diaries.map((diary, i) => (
            <tr key={diary.id}>
              <th scope="row">{i + 1}</th>
              <td>{diary.id}</td>
              <td>{diary.userId}</td>
              <td>{diary.content}</td>
              <td>{diary.createdAt}</td>
              <td>{diary.deletedAt ?? ''}</td>
              <td>
                <form action={`/admin/diary/delete/${diary.id}`} method="post">
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
