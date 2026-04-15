// frontend/components/SelectedGalleryPage/SelectedGalleryPage.tsx
//
// /gallery/selected/:id ページ（ギャラリー個別表示）の React コンポーネント。
// いいね・コメントは fetch API で処理。関連画像・職人情報をサイドバーに表示。

import { useState } from 'react';
import { ThreeViewer } from '../../three/ThreeViewer';
import { getCsrfToken } from '../../utils/csrf';

interface GalleryCommentItem {
  name: string;
  avatarPath: string;
  comment: string;
  postTime: string;
}

interface Creator {
  userId: number;
  name: string;
  avatarPath: string;
  title: string;
  establishment: number;
  employee: number;
}

interface RelatedGallery {
  id: number;
  dataUrl: string;
}

interface CurrentUser {
  id: number;
  name: string;
  avatarPath: string;
}

interface Props {
  galleryId: number;
  dataUrl: string;
  tags: string[];
  comment: string;
  createdAt: string;
  goodCount: number;
  myGood: boolean;
  comments: GalleryCommentItem[];
  matchTagGalleries: RelatedGallery[];
  otherGalleries: RelatedGallery[];
  creator: Creator;
  loggedIn: boolean;
  currentUser: CurrentUser | null;
}

export const SelectedGalleryPage = ({
  galleryId,
  dataUrl,
  tags,
  comment,
  createdAt,
  goodCount: initialGoodCount,
  myGood: initialMyGood,
  comments: initialComments,
  matchTagGalleries,
  otherGalleries,
  creator,
  loggedIn,
  currentUser,
}: Props) => {
  const [goodCount, setGoodCount] = useState(initialGoodCount);
  const [myGood, setMyGood] = useState(initialMyGood);
  const [comments, setComments] = useState<GalleryCommentItem[]>(initialComments);
  const [commentText, setCommentText] = useState('');

  const handleGood = async () => {
    if (myGood) return;
    await fetch(`/gallery/selected/good/${galleryId}`, {
      method: 'POST',
      headers: { 'X-CSRF-Token': getCsrfToken() },
    });
    setMyGood(true);
    setGoodCount((c) => c + 1);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    const res = await fetch(`/gallery/selected/comment/${galleryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
      },
      body: JSON.stringify({ gallery_comment: { comment: commentText } }),
    });
    if (res.ok || res.redirected) {
      setComments((prev) => [
        ...prev,
        {
          name: currentUser.name,
          avatarPath: currentUser.avatarPath,
          comment: commentText,
          postTime: new Date().toLocaleString('ja-JP'),
        },
      ]);
      setCommentText('');
    }
  };

  return (
    <div className="row my-selected-row">
      {/* メインカラム */}
      <div className="col-lg-9 selected-gallery-box">
        <div className="selected-gallery-box-in-box">
          <img src={dataUrl} width="100%" height="850px" alt="ギャラリー画像" />
          <div className="post-time-text">{createdAt}</div>
          <div className="selected-gallery-box-text">
            <p>{comment}</p>
          </div>
        </div>

        {/* 3D ビューワー */}
        <div className="selected-gallery-3d-box">
          <div className="selected-gallery-3d-label">3D プレビュー（ドラッグで回転）</div>
          <ThreeViewer height={400} />
        </div>

        {/* タグ一覧 */}
        <div className="tag-list-box">
          {tags.map((tag) => (
            <p key={tag} className="selected-gallery-tag">
              <span className="label selected-gallery-tag-in">{tag}</span>
            </p>
          ))}
        </div>

        {/* アクションボタン */}
        <div className="icon-btn-box text-right">
          {/* いいねボタン */}
          <button
            type="button"
            className="btn icon-btn"
            onClick={handleGood}
            disabled={myGood || !loggedIn}
          >
            <i className="fas fa-thumbs-up thumbs-up-icon" />
            {goodCount}
          </button>

          {/* コメントトグル */}
          <button
            type="button"
            className="btn icon-btn good-and-comment"
            data-toggle="collapse"
            data-target={`#gallery-${galleryId}`}
          >
            <i className="fas fa-comment-alt comment-icon" />
            {comments.length}
          </button>

          {/* コメント一覧・フォーム */}
          <div className="collapse" id={`gallery-${galleryId}`}>
            {comments.map((c) => (
              <div key={`${c.postTime}-${c.name}`} className="card comment-card text-left">
                <div className="card-header comment-header">
                  <p>
                    <img
                      src={c.avatarPath}
                      className="rounded-circle"
                      width={45}
                      height={45}
                      alt={c.name}
                    />
                    {c.name}
                  </p>
                </div>
                <div className="card-body comment-body">
                  <p>{c.comment}</p>
                </div>
                <div className="card-footer comment-time text-right">{c.postTime}</div>
              </div>
            ))}

            {loggedIn && currentUser ? (
              <form onSubmit={handleComment}>
                <div className="card input-comment-box text-left">
                  <div className="card-header input-comment-header">
                    <div className="input-comment-header-in">
                      <img
                        src={currentUser.avatarPath}
                        className="rounded-circle"
                        width={43}
                        height={43}
                        alt={currentUser.name}
                      />
                      {currentUser.name}
                    </div>
                  </div>
                  <div className="card-body input-comment-body">
                    <textarea
                      className="form-control"
                      placeholder="100文字以内"
                      rows={3}
                      maxLength={100}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                  </div>
                  <div className="card-footer input-comment-footer">
                    <div className="text-right">
                      <button type="submit" className="btn comment-btn">
                        コメント
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <p className="no-login-text">ログインしてください</p>
            )}
          </div>
        </div>

        {/* 関連画像 */}
        {matchTagGalleries.length > 0 && (
          <div className="match-tag-box">
            <div className="match-tag-box-header">関連画像</div>
            <div className="row justify-content-center my-match-row">
              {matchTagGalleries.map((g) => (
                <div key={g.id} className="col-lg-4 match-tag-content">
                  <a href={`/gallery/selected/${g.id}`}>
                    <img src={g.dataUrl} width="100%" height="100%" alt="関連画像" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* サイドバー */}
      <div className="col-lg-3 selected-gallery-side">
        {/* 職人情報 */}
        <div className="user-info-box">
          <div className="user-img-box">
            <a href={`/page/creator/${creator.userId}`}>
              <div className="user-img">
                <img
                  src={creator.avatarPath}
                  className="rounded-circle"
                  width={180}
                  height={180}
                  alt="アバター"
                />
              </div>
              <div className="user-name">
                <h3>{creator.name}</h3>
              </div>
            </a>
          </div>
          <div className="card my-card">
            <div className="card-header my-card-header">創作作品名</div>
            <div className="card-body my-card-body">
              <p className="card-text user-info-text">{creator.title}</p>
            </div>
          </div>
          <div className="card my-card">
            <div className="card-header my-card-header">創業年数</div>
            <div className="card-body my-card-body">
              <p className="card-text user-info-text">{creator.establishment}年</p>
            </div>
          </div>
          <div className="card my-card">
            <div className="card-header my-card-header">従業員数</div>
            <div className="card-body my-card-body">
              <p className="card-text user-info-text">{creator.employee}人</p>
            </div>
          </div>
        </div>

        {/* その他の投稿 */}
        {otherGalleries.length > 0 && (
          <div className="other-box">
            <div className="other-box-header">その他の投稿</div>
            {otherGalleries.map((g) => (
              <div key={g.id} className="other-content">
                <a href={`/gallery/selected/${g.id}`}>
                  <img src={g.dataUrl} width="100%" height="100%" alt="その他の投稿" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
