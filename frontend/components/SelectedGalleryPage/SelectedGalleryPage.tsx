// frontend/components/SelectedGalleryPage/SelectedGalleryPage.tsx
//
// /gallery/selected/:id ページ（ギャラリー個別表示）の React コンポーネント。
// いいね・コメントは fetch API で処理。関連画像・職人情報をサイドバーに表示。

import { useState } from 'react';
import { ThreeViewer } from '../../three/ThreeViewer';
import { postJson } from '../../utils/postJson';
import { FlashMessages } from '../FlashMessages';

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
  flash: Record<string, string>;
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
  flash,
}: Props) => {
  const [goodCount, setGoodCount] = useState(initialGoodCount);
  const [myGood, setMyGood] = useState(initialMyGood);
  const [comments, setComments] = useState<GalleryCommentItem[]>(initialComments);
  const [commentText, setCommentText] = useState('');

  const handleGood = async () => {
    if (myGood) return;
    await postJson(`/gallery/selected/good/${galleryId}`);
    setMyGood(true);
    setGoodCount((c) => c + 1);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    const res = await postJson(`/gallery/selected/comment/${galleryId}`, {
      gallery_comment: { comment: commentText },
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
    <>
      <FlashMessages flash={flash} />

      <div className='row w-full pl-[1.5%] mb-[13%]'>
        {/* メインカラム */}
        <div className='col-lg-9 py-[0.5%] px-[0.3%] pb-[5%] m-0 bg-[#275D39] border border-[#1F4B2E] rounded-[7px]'>
          <div className='bg-white rounded-[0_0_7px_7px]'>
            <img src={dataUrl} width='100%' height='850px' alt='ギャラリー画像' />
            <div className='py-[0.3%] px-[0.5%] m-0 text-[19px] text-[#333] text-right bg-[#FCF2D3] border-b border-[#ccc]'>
              {createdAt}
            </div>
            <div className='py-[1%] px-[3%] bg-[#FCF2D3] text-[25px]'>
              <p>{comment}</p>
            </div>
          </div>

          {/* 3D ビューワー */}
          <div className='selected-gallery-3d-box'>
            <div className='selected-gallery-3d-label'>3D プレビュー（ドラッグで回転）</div>
            <ThreeViewer height={400} />
          </div>

          {/* タグ一覧 */}
          <div className='bg-p-brand pt-[1%] pb-[1.5%] pl-[0.5%] pr-0'>
            {tags.map((tag) => (
              <p
                key={tag}
                className='py-2 pl-2 pr-[5px] mt-[0.8%] ml-[0.8%] bg-[#F29626] rounded-[5px] inline-block'
              >
                <span className='label p-0 text-center text-[#181818] text-[23px]'>{tag}</span>
              </p>
            ))}
          </div>

          {/* アクションボタン */}
          <div className='icon-btn-box text-right'>
            {/* いいねボタン */}
            <button
              type='button'
              className='btn icon-btn'
              onClick={handleGood}
              disabled={myGood || !loggedIn}
            >
              <i className='fas fa-thumbs-up thumbs-up-icon' />
              {goodCount}
            </button>

            {/* コメントトグル */}
            <button
              type='button'
              className='btn icon-btn good-and-comment'
              data-toggle='collapse'
              data-target={`#gallery-${galleryId}`}
            >
              <i className='fas fa-comment-alt comment-icon' />
              {comments.length}
            </button>

            {/* コメント一覧・フォーム */}
            <div className='collapse' id={`gallery-${galleryId}`}>
              {comments.map((c) => (
                <div
                  key={`${c.postTime}-${c.name}`}
                  className='card my-[1%] ml-[1%] bg-white text-left'
                >
                  <div className='card-header pt-[0.3%] pl-[0.5%] pb-0 text-[18px]'>
                    <p>
                      <img
                        src={c.avatarPath}
                        className='rounded-circle'
                        width={45}
                        height={45}
                        alt={c.name}
                      />
                      {c.name}
                    </p>
                  </div>
                  <div className='card-body py-[0.5%] pl-[2%]'>
                    <p className='text-[19px]'>{c.comment}</p>
                  </div>
                  <div className='card-footer p-[0.1%] text-[#555] text-right'>{c.postTime}</div>
                </div>
              ))}

              {loggedIn && currentUser ? (
                <form onSubmit={handleComment}>
                  <div className='card my-[1.5%] mr-[9%] ml-[10%] text-left'>
                    <div className='card-header py-[0.5%] pl-[0.5%] text-[19px] bg-[#FCF2D3]'>
                      <div>
                        <img
                          src={currentUser.avatarPath}
                          className='rounded-circle'
                          width={43}
                          height={43}
                          alt={currentUser.name}
                        />
                        {currentUser.name}
                      </div>
                    </div>
                    <div className='card-body bg-[#FCF2D3] p-[0.5%]'>
                      <textarea
                        className='form-control'
                        placeholder='100文字以内'
                        rows={3}
                        maxLength={100}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                    </div>
                    <div className='card-footer py-[0.5%] pr-[2%] pl-[0.5%] bg-[#5cb85c]'>
                      <div className='text-right'>
                        <button type='submit' className='btn bg-[#FFA30D]'>
                          コメント
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <p className='pt-[0.7%] pb-[1%] pl-[3%] text-[23px] text-white'>
                  ログインしてください
                </p>
              )}
            </div>
          </div>

          {/* 関連画像 */}
          {matchTagGalleries.length > 0 && (
            <div className='mt-[5%] mb-[3%] bg-[#2A553B] border border-[#21442F] rounded-[5px]'>
              <div className='pt-[0.2%] pl-[1%] pb-[1%] text-[22px] text-white text-left'>
                関連画像
              </div>
              <div className='row justify-content-center m-0 w-full'>
                {matchTagGalleries.map((g) => (
                  <div key={g.id} className='col-lg-4 p-0 h-[37vh] border border-[#1F4B2E]'>
                    <a href={`/gallery/selected/${g.id}`}>
                      <img src={g.dataUrl} width='100%' height='100%' alt='関連画像' />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* サイドバー */}
        <div className='col-lg-3 pt-[0.5%] pr-[0.5%] pb-0 pl-[0.6%] m-0 bg-[#275D39] border border-[#1F4B2E] rounded-[7px]'>
          {/* 職人情報 */}
          <div className='bg-[#eee] w-full min-h-[55vh] mb-[19vh] rounded-[7px]'>
            <div className='bg-[#BAA9DA] mx-auto rounded-t-[7px] hover:opacity-80'>
              <a href={`/page/creator/${creator.userId}`}>
                <div className='w-full text-center'>
                  <img
                    src={creator.avatarPath}
                    className='rounded-circle'
                    width={180}
                    height={180}
                    alt='アバター'
                  />
                </div>
                <div className='pt-[13px] pb-2 text-center'>
                  <h3 className='text-[33px]'>{creator.name}</h3>
                </div>
              </a>
            </div>
            <div className='card border-2 border-[#D7CDE9] bg-[#FCF2D3] mt-[7%] rounded-[5px]'>
              <div className='card-header bg-[#BAA9DA] pt-[5%] pl-[2%] pb-0 text-[19px]'>
                創作作品名
              </div>
              <div className='card-body text-center pt-[3%] pb-[4%] px-0'>
                <p className='card-text text-[23px] p-0'>{creator.title}</p>
              </div>
            </div>
            <div className='card border-2 border-[#D7CDE9] bg-[#FCF2D3] mt-[7%] rounded-[5px]'>
              <div className='card-header bg-[#BAA9DA] pt-[5%] pl-[2%] pb-0 text-[19px]'>
                創業年数
              </div>
              <div className='card-body text-center pt-[3%] pb-[4%] px-0'>
                <p className='card-text text-[23px] p-0'>{creator.establishment}年</p>
              </div>
            </div>
            <div className='card border-2 border-[#D7CDE9] bg-[#FCF2D3] mt-[7%] rounded-[5px]'>
              <div className='card-header bg-[#BAA9DA] pt-[5%] pl-[2%] pb-0 text-[19px]'>
                従業員数
              </div>
              <div className='card-body text-center pt-[3%] pb-[4%] px-0'>
                <p className='card-text text-[23px] p-0'>{creator.employee}人</p>
              </div>
            </div>
          </div>

          {/* その他の投稿 */}
          {otherGalleries.length > 0 && (
            <div className='p-[2%] bg-p-brand rounded-t-[5px]'>
              <div className='text-[22px] text-white'>その他の投稿</div>
              {otherGalleries.map((g) => (
                <div key={g.id} className='p-0 h-[37vh] border border-[#1F4B2E]'>
                  <a href={`/gallery/selected/${g.id}`}>
                    <img src={g.dataUrl} width='100%' height='100%' alt='その他の投稿' />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
