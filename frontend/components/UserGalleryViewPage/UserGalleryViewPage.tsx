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
    <h1 className="main-title">{userName}さんのギャラリー</h1>

    <FlashMessages flash={flash} />

    {galleries.length > 0 && (
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
    )}

    <div className="row user-gallery-row">
      <div className="col-lg-12 gallery-col">
        {galleries.length === 0 ? (
          <div className="nil-box">
            <p className="empty-text">まだありません</p>
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
