// frontend/components/AdminInquiryEditPage/AdminInquiryEditPage.tsx
//
// /admin/management/inquiry ページの React コンポーネント。
// 問い合わせ一覧テーブル + チェックボタン。
//
// 【data-props】
//   inquiries: [{ id, userId, name, content, isCheck, createdAt, updatedAt, deletedAt }]

import { AdminSideMenu } from '../AdminSideMenu';
import { FlashMessages } from '../FlashMessages';

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
  flash: Record<string, string>;
}

export const AdminInquiryEditPage = ({ inquiries, flash }: Props) => (
  <div className="w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap">
    <AdminSideMenu activeKey="inquiry" />
    <div className="w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll">
      <h1 className="text-center text-[60px]">問い合わせ管理</h1>

      <FlashMessages flash={flash} />
      <table className="w-screen overflow-x-scroll overflow-y-scroll">
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
                  <span className="inline-block px-2 py-1 text-xs rounded-full text-[19px] bg-green-600 text-white">
                    OK
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs rounded-full text-[19px] bg-red-600 text-white">
                    No
                  </span>
                )}
              </td>
              <td>{inquiry.createdAt}</td>
              <td>{inquiry.elapsedDays}日前</td>
              <td>{inquiry.updatedAt}</td>
              <td>{inquiry.deletedAt ?? ''}</td>
              <td>
                <a
                  href={`/admin/inquiry/detail/${inquiry.id}`}
                  className="px-4 py-2 bg-[#f0ad4e] text-black rounded hover:opacity-80 inline-block"
                >
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
