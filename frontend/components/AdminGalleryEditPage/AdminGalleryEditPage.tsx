// frontend/components/AdminGalleryEditPage/AdminGalleryEditPage.tsx
//
// /admin/management/gallery ページの React コンポーネント。
// ギャラリー一覧テーブル + 削除ボタン。
//
// 【data-props】
//   galleries: [{ id, userId, data, comment, createdAt, deletedAt }]

import { getCsrfToken } from '../../utils/csrf';
import { AdminSideMenu } from '../AdminSideMenu';
import { FlashMessages } from '../FlashMessages';

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
  flash: Record<string, string>;
}

export const AdminGalleryEditPage = ({ galleries, flash }: Props) => (
  <div className='w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap'>
    <AdminSideMenu activeKey='gallery' />
    <div className='w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll'>
      <h1 className='text-center text-[60px]'>ギャラリー管理</h1>

      <FlashMessages flash={flash} />
      <table className='w-screen overflow-x-scroll overflow-y-scroll'>
        <thead>
          <tr>
            <th scope='col'>＃</th>
            <th scope='col'>ID</th>
            <th scope='col'>ユーザーID</th>
            <th scope='col'>画像</th>
            <th scope='col'>コメント</th>
            <th scope='col'>登録日時</th>
            <th scope='col'>削除日時</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {galleries.map((gallery, i) => (
            <tr key={gallery.id}>
              <th scope='row'>{i + 1}</th>
              <td>{gallery.id}</td>
              <td>{gallery.userId}</td>
              <td>
                <img src={gallery.data} width={160} height={100} alt='' />
              </td>
              <td>{gallery.comment}</td>
              <td>{gallery.createdAt}</td>
              <td>{gallery.deletedAt ?? ''}</td>
              <td>
                <form action={`/admin/gallery/delete/${gallery.id}`} method='post'>
                  <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                  <button type='submit' className='px-4 py-2 bg-red-600 text-white rounded hover:opacity-80'>
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
