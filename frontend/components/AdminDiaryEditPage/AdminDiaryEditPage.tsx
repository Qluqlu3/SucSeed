// frontend/components/AdminDiaryEditPage/AdminDiaryEditPage.tsx
//
// /admin/management/diary ページの React コンポーネント。
// 日記一覧テーブル + 削除ボタン。
//
// 【data-props】
//   diaries: [{ id, userId, content, createdAt, deletedAt }]

import { getCsrfToken } from '../../utils/csrf';
import { AdminSideMenu } from '../AdminSideMenu';
import { FlashMessages } from '../FlashMessages';

interface AdminDiary {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  deletedAt: string | null;
}

interface Props {
  diaries: AdminDiary[];
  flash: Record<string, string>;
}

export const AdminDiaryEditPage = ({ diaries, flash }: Props) => (
  <div className="w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap">
    <AdminSideMenu activeKey="diary" />
    <div className="w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll">
      <h1 className="text-center text-[60px]">日記管理</h1>

      <FlashMessages flash={flash} />
      <table className="w-screen overflow-x-scroll overflow-y-scroll">
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
