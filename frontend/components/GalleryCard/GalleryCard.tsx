// frontend/components/GalleryCard/GalleryCard.tsx
//
// ギャラリーサムネイルカード共通コンポーネント。
// UserGalleryViewPage / MyGalleryPage / FavoriteGalleryPage / HeirFavoriteGalleryPage で共用。

export interface GalleryItem {
  id: number;
  dataUrl: string;
  tags: string[];
  goodCount: number;
  myGood: boolean;
}

export const GalleryCard = ({ gallery }: { gallery: GalleryItem }) => (
  <div className='col-lg-4 card-col'>
    <a href={`/gallery/selected/${gallery.id}`}>
      <div className='card gallery-card'>
        <div className='card-header gallery-card-header'>
          <img src={gallery.dataUrl} width='100%' height='380px' alt='ギャラリー画像' />
        </div>
        <div className='card-body gallery-card-body'>
          <p className='card-tag'>
            {gallery.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className='label my-label'>
                {tag}
              </span>
            ))}
          </p>
          <div className='text-right gallery-icon-box'>
            <i className='fas fa-thumbs-up thumbs-up-icon sub-thumbs-up-icon' />
            {gallery.goodCount}
          </div>
        </div>
      </div>
    </a>
  </div>
);
