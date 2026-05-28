import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';
import { FlashMessages } from '../FlashMessages';

interface Props {
  galleries: GalleryItem[];
  flash: Record<string, string>;
}

export const HeirFavoriteGalleryPage = ({ galleries, flash }: Props) => (
  <>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>ギャラリー</h1>

    <FlashMessages flash={flash} />

    <div className='flex flex-wrap m-0 p-0'>
      <div className='w-full p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px] min-h-[55vh]'>
        {galleries.length === 0 ? (
          <p className='mt-[10%] ml-[15%] text-[39px] text-white'>まだありません</p>
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
