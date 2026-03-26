// frontend/components/AdminGalleryEditPage/AdminGalleryEditPage.tsx
//
// /admin/management/gallery ページの React コンポーネント。
// ギャラリー一覧テーブル + 削除ボタン。
//
// 【data-props】
//   galleries: [{ id, userId, data, comment, createdAt, deletedAt }]

import { AdminSideMenu } from '../AdminSideMenu';

interface AdminGallery {
  id: number;
  userId: number;
  data: string;
  comment: string;
  createdAt: string;
  deletedAt: string | null;
}

interface Props {
  galleries: AdminGallery[];
}

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

export const AdminGalleryEditPage = ({ galleries }: Props) => (
  <div className="row admin-row">
    <AdminSideMenu activeKey="gallery" />
    <div className="col-10 admin-col-9">
      <h1 className="admin-main-title">ギャラリー管理</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">＃</th>
            <th scope="col">ID</th>
            <th scope="col">ユーザーID</th>
            <th scope="col">画像</th>
            <th scope="col">コメント</th>
            <th scope="col">登録日時</th>
            <th scope="col">削除日時</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {galleries.map((gallery, i) => (
            <tr key={gallery.id}>
              <th scope="row">{i + 1}</th>
              <td>{gallery.id}</td>
              <td>{gallery.userId}</td>
              <td>
                <img src={gallery.data} width={160} height={100} alt="" />
              </td>
              <td>{gallery.comment}</td>
              <td>{gallery.createdAt}</td>
              <td>{gallery.deletedAt ?? ''}</td>
              <td>
                <form action={`/admin/gallery/delete/${gallery.id}`} method="post">
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
