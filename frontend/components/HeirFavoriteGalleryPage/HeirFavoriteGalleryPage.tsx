import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';

interface Props {
  galleries: GalleryItem[];
}

export const HeirFavoriteGalleryPage = ({ galleries }: Props) => (
  <>
    <h1 className="main-title">ギャラリー</h1>

    <div className="row my-row">
      <div className="col-lg-12 gallery-col heir-favorite-box">
        {galleries.length === 0 ? (
          <p className="empty-text">まだありません</p>
        ) : (
          <div className="row my-row">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);
