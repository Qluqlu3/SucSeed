import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

interface Props {
  userName: string;
  userId: number;
  galleries: GalleryItem[];
}

export const GallerySearchPage = ({ userName, userId, galleries }: Props) => (
  <>
    <h1 className="main-title">{userName}さんのギャラリー</h1>

    <div className="gallery-search-box">
      <form
        action={`/gallery/user/search/tag/${userId}`}
        method="post"
        className="gallery-search-tag"
      >
        <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
        <input
          type="text"
          name="search_tag"
          className="form-control"
          placeholder="search tag ..."
        />
        <button type="submit" className="btn my-2 my-sm-0 search_btn">
          <i className="fas fa-search search_icon" />
        </button>
      </form>
    </div>

    <div className="row user-gallery-row">
      <div className="col-md-12 gallery-col">
        {galleries.length === 0 ? (
          <div className="nil-box">
            <p className="empty-text">検索結果なし</p>
          </div>
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
