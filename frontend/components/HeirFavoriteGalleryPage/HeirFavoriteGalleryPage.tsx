import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';
import { FlashMessages } from '../FlashMessages';

interface Props {
  galleries: GalleryItem[];
  flash: Record<string, string>;
}

export const HeirFavoriteGalleryPage = ({ galleries, flash }: Props) => (
  <>
    <h1 className='main-title'>ギャラリー</h1>

    <FlashMessages flash={flash} />

    <div className='row my-row'>
      <div className='col-lg-12 gallery-col heir-favorite-box'>
        {galleries.length === 0 ? (
          <p className='empty-text'>まだありません</p>
        ) : (
          <div className='row my-row'>
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);
