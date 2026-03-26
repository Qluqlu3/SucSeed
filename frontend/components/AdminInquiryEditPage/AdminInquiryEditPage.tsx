// frontend/components/AdminInquiryEditPage/AdminInquiryEditPage.tsx
//
// /admin/management/inquiry ページの React コンポーネント。
// 問い合わせ一覧テーブル + チェックボタン。
//
// 【data-props】
//   inquiries: [{ id, userId, name, content, isCheck, createdAt, updatedAt, deletedAt }]

import { AdminSideMenu } from '../AdminSideMenu';

interface AdminInquiry {
  id: number;
  userId: number;
  name: string;
  content: string;
  isCheck: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  elapsedDays: number;
}

interface Props {
  inquiries: AdminInquiry[];
}

export const AdminInquiryEditPage = ({ inquiries }: Props) => (
  <div className="row admin-row">
    <AdminSideMenu activeKey="inquiry" />
    <div className="col-10 admin-col-9">
      <h1 className="admin-main-title">問い合わせ管理</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">＃</th>
            <th scope="col">ID</th>
            <th scope="col">ユーザーID</th>
            <th scope="col">カテゴリー</th>
            <th scope="col">内容</th>
            <th scope="col">対応チェック</th>
            <th scope="col">登録日時</th>
            <th scope="col">経過日数</th>
            <th scope="col">更新日時</th>
            <th scope="col">削除日時</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry, i) => (
            <tr key={inquiry.id}>
              <th scope="row">{i + 1}</th>
              <td>{inquiry.id}</td>
              <td>{inquiry.userId}</td>
              <td>{inquiry.name}</td>
              <td>{inquiry.content}</td>
              <td>
                {inquiry.isCheck ? (
                  <span className="badge badge-success">OK</span>
                ) : (
                  <span className="badge badge-danger">No</span>
                )}
              </td>
              <td>{inquiry.createdAt}</td>
              <td>{inquiry.elapsedDays}日前</td>
              <td>{inquiry.updatedAt}</td>
              <td>{inquiry.deletedAt ?? ''}</td>
              <td>
                <a href={`/admin/inquiry/detail/${inquiry.id}`} className="btn btn-warning">
                  チェック
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
