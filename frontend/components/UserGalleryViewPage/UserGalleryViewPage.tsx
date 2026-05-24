// frontend/components/UserGalleryViewPage/UserGalleryViewPage.tsx
//
// /gallery/view/:id ページ（特定ユーザーのギャラリー一覧）の React コンポーネント。
// タグ検索フォームは POST /gallery/user/search/tag/:userId へ送信。

import { getCsrfToken } from '../../utils/csrf';
import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';
import { FlashMessages } from '../FlashMessages';

interface Props {
  userName: string;
  userId: number;
  galleries: GalleryItem[];
  flash: Record<string, string>;
}

export const UserGalleryViewPage = ({ userName, userId, galleries, flash }: Props) => (
  <>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>
      {userName}さんのギャラリー
    </h1>

    <FlashMessages flash={flash} />

    {galleries.length > 0 && (
      <div className='w-full pr-[2%] pb-[1%] text-right'>
        <form action={`/gallery/user/search/tag/${userId}`} method='post' className='inline-flex'>
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
          <input
            type='text'
            name='search_tag'
            className='form-control'
            placeholder='search tag ...'
          />
          <button type='submit' className='btn my-2 my-sm-0 search_btn'>
            <i className='fas fa-search search_icon' />
          </button>
        </form>
      </div>
    )}

    <div className='row min-h-[70vh] m-0 py-0 px-[0.7%] w-full'>
      <div className='col-lg-12 p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]'>
        {galleries.length === 0 ? (
          <div className='h-[50vh]'>
            <p className='mt-[10%] ml-[15%] text-[39px] text-white'>まだありません</p>
          </div>
        ) : (
          <div className='row m-0 p-0'>
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);
