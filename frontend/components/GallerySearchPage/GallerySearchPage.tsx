import { getCsrfToken } from '../../utils/csrf';
import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';
import { FlashMessages } from '../FlashMessages';

interface Props {
  userName: string;
  userId: number;
  galleries: GalleryItem[];
  flash: Record<string, string>;
}

export const GallerySearchPage = ({ userName, userId, galleries, flash }: Props) => (
  <>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>
      {userName}さんのギャラリー
    </h1>

    <FlashMessages flash={flash} />

    <div className='w-full pr-[2%] pb-[1%] text-right'>
      <form action={`/gallery/user/search/tag/${userId}`} method='post' className='inline-flex'>
        <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
        <input
          type='text'
          name='search_tag'
          className='rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none'
          placeholder='search tag ...'
        />
        <button type='submit' className='rounded bg-p-brand px-3 py-2 text-white hover:opacity-80 search_btn'>
          <i className='fas fa-search search_icon' />
        </button>
      </form>
    </div>

    <div className='flex flex-wrap min-h-[70vh] m-0 py-0 px-[0.7%] w-full'>
      <div className='w-full p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]'>
        {galleries.length === 0 ? (
          <div className='h-[50vh]'>
            <p className='mt-[10%] ml-[15%] text-[39px] text-white'>検索結果なし</p>
          </div>
        ) : (
          <div className='flex flex-wrap m-0 p-0'>
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);
