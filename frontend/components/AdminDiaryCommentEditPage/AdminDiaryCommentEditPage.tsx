// frontend/components/AdminDiaryCommentEditPage/AdminDiaryCommentEditPage.tsx
//
// /admin/management/diary_comment ページの React コンポーネント。
// 日記コメント一覧テーブル + 削除ボタン。
//
// 【data-props】
//   comments: [{ id, userId, diaryId, comment, createdAt, deletedAt }]

import { getCsrfToken } from '../../utils/csrf';
import { AdminSideMenu } from '../AdminSideMenu';
import { FlashMessages } from '../FlashMessages';

interface AdminDiaryComment {
  id: number;
  userId: number;
  diaryId: number;
  comment: string;
  createdAt: string;
  deletedAt: string | null;
}

interface Props {
  comments: AdminDiaryComment[];
  flash: Record<string, string>;
}

export const AdminDiaryCommentEditPage = ({ comments, flash }: Props) => (
  <div className='w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap'>
    <AdminSideMenu activeKey='diary_comment' />
    <div className='w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll'>
      <h1 className='text-center text-[60px]'>日記コメント管理</h1>

      <FlashMessages flash={flash} />
      <table className='w-screen overflow-x-scroll overflow-y-scroll'>
        <thead>
          <tr>
            <th scope='col'>＃</th>
            <th scope='col'>ID</th>
            <th scope='col'>ユーザーID</th>
            <th scope='col'>ダイアリーID</th>
            <th scope='col'>コメント</th>
            <th scope='col'>登録日時</th>
            <th scope='col'>削除日時</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {comments.map((c, i) => (
            <tr key={c.id}>
              <th scope='row'>{i + 1}</th>
              <td>{c.id}</td>
              <td>{c.userId}</td>
              <td>{c.diaryId}</td>
              <td>{c.comment}</td>
              <td>{c.createdAt}</td>
              <td>{c.deletedAt ?? ''}</td>
              <td>
                <form action={`/admin/diary_comment/delete/${c.id}`} method='post'>
                  <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                  <button
                    type='submit'
                    className='px-4 py-2 bg-red-600 text-white rounded hover:opacity-80'
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
