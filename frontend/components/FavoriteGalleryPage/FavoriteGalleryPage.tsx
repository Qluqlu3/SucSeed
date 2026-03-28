import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';
import { getCsrfToken } from '../../utils/csrf';

interface Props {
  galleries: GalleryItem[];
  errors: string[];
}

export const FavoriteGalleryPage = ({ galleries, errors }: Props) => (
  <>
    <h1 className="main-title">ギャラリー</h1>

    {errors.length > 0 && (
      <div className="alert alert-danger">
        <ul>
          {errors.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="all-cover-box">
      <div className="row my-row">
        <div className="col-md-9 gallery-col">
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

        <div className="col-sm-3 post-col">
          <div className="right-box">
            <form action="/gallery/view" method="post" encType="multipart/form-data">
              <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
              <div className="form-group">
                <div className="right-box-top">
                  <label className="right-box-title">投稿</label>
                </div>
                <input
                  type="file"
                  name="gallery[data]"
                  className="form-control-file my-file-post"
                  accept="image/jpg,image/jpeg,image/png"
                />
                <label className="tag-title">タグ：</label>
                <div className="tag-field">
                  <input type="text" name="gallery[tag_list]" placeholder="タグを入力" />
                </div>
                <div className="comment-box">
                  <label className="form-input-label">コメント：</label>
                  <textarea
                    name="gallery[comment]"
                    className="form-control"
                    placeholder="100文字以内"
                    rows={3}
                  />
                </div>
                <div className="text-right gallery-post-btn-box">
                  <button type="submit" className="btn btn-lg my-submit-btn">
                    投稿
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
);
