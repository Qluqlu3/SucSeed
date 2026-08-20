// frontend/components/SelectedGalleryPage/SelectedGalleryPage.tsx
//
// /gallery/selected/:id ページ（ギャラリー個別表示）の React コンポーネント。
// いいね・コメントは /api/v1 の JSON API で処理。関連画像・職人情報をサイドバーに表示。
//
// props の形は Rails の GalleryDetailSerializer と一対一で対応しており、
// GET /api/v1/galleries/:id が返すものと同じ（HTML 側は data-props 経由で渡している）。

import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import type { Comment, GalleryDetail, Id } from '../../api';
import { api } from '../../api';
import { ThreeViewer } from '../../three/ThreeViewer';
import { FlashMessages } from '../FlashMessages';

interface CurrentUser {
  id: Id;
  name: string;
  avatarPath: string;
}

interface Props extends GalleryDetail {
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
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // いいね数・いいね済みフラグはサーバーが返した値をそのまま採用する。
  // クライアント側で +1 していた旧実装は、他ユーザーの操作と競合するとズレていた。
  const handleGood = async () => {
    if (!loggedIn) return;
    setErrorMessage(null);
    const result = myGood
      ? await api.galleries.unlike(galleryId)
      : await api.galleries.like(galleryId);

    if (result.ok) {
      setMyGood(result.data.myGood);
      setGoodCount(result.data.goodCount);
    } else {
      setErrorMessage(result.error.message);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    setErrorMessage(null);

    const result = await api.galleries.comment(galleryId, commentText);
    if (result.ok) {
      // 表示は API が返したコメント（サーバー側の日時書式・整形済み）をそのまま使う
      setComments((prev) => [result.data.comment, ...prev]);
      setCommentText('');
    } else {
      setErrorMessage(result.error.details[0] ?? result.error.message);
    }
  };

  return (
    <>
      <FlashMessages flash={errorMessage ? { ...flash, danger: errorMessage } : flash} />

      <div className="flex flex-wrap w-full pl-[1.5%] mb-[13%]">
        {/* メインカラム */}
        <div className="w-full lg:w-9/12 py-[0.5%] px-[0.3%] pb-[5%] m-0 bg-p-dark border border-p-brand rounded-[7px]">
          <div className="bg-white rounded-[0_0_7px_7px]">
            <img src={dataUrl} width="100%" height="850px" alt="ギャラリー画像" />
            <div className="py-[0.3%] px-[0.5%] m-0 text-[19px] text-[#333] text-right bg-p-light border-b border-[#ccc]">
              {createdAt}
            </div>
            <div className="py-[1%] px-[3%] bg-p-light text-[25px]">
              <p>{comment}</p>
            </div>
          </div>

          {/* 3D ビューワー */}
          <div className="mt-[1%]">
            <div className="bg-p-light px-[1%] py-[0.5%] text-[19px] text-p-text">
              3D プレビュー（ドラッグで回転）
            </div>
            <ThreeViewer height={400} />
          </div>

          {/* タグ一覧 */}
          <div className="bg-p-brand pt-[1%] pb-[1.5%] pl-[0.5%] pr-0">
            {tags.map((tag) => (
              <p
                key={tag}
                className="py-2 pl-2 pr-[5px] mt-[0.8%] ml-[0.8%] bg-p-gold rounded-[5px] inline-block"
              >
                <span className="label p-0 text-center text-[#181818] text-[23px]">{tag}</span>
              </p>
            ))}
          </div>

          {/* アクションボタン */}
          <div className="text-right">
            {/* いいねボタン（API がトグルに対応したので取り消しもできる） */}
            <button
              type="button"
              className={`rounded px-3 py-1 hover:opacity-80 ${myGood ? 'bg-p-gold' : 'bg-p-brand'}`}
              onClick={handleGood}
              disabled={!loggedIn}
              aria-pressed={myGood}
              aria-label={myGood ? 'いいねを取り消す' : 'いいねする'}
            >
              <ThumbsUp className="text-white" size={21} />
              {goodCount}
            </button>

            {/* コメントトグル */}
            <button
              type="button"
              className="rounded bg-p-brand px-3 py-1 hover:opacity-80"
              onClick={() => setShowComments((v) => !v)}
            >
              <MessageSquare className="text-white" size={21} />
              {comments.length}
            </button>

            {/* コメント一覧・フォーム */}
            <div className={showComments ? 'block' : 'hidden'}>
              {comments.map((c) => (
                <div key={c.id} className="my-[1%] ml-[1%] bg-white text-left rounded">
                  <div className="pt-[0.3%] pl-[0.5%] pb-0 text-[18px] border-b border-gray-200">
                    <p>
                      <img
                        src={c.avatarPath}
                        className="rounded-full"
                        width={45}
                        height={45}
                        alt={c.name}
                      />
                      {c.name}
                    </p>
                  </div>
                  <div className="py-[0.5%] pl-[2%]">
                    <p className="text-[19px]">{c.comment}</p>
                  </div>
                  <div className="p-[0.1%] text-[#555] text-right border-t border-gray-200">
                    {c.postTime}
                  </div>
                </div>
              ))}

              {loggedIn && currentUser ? (
                <form onSubmit={handleComment}>
                  <div className="my-[1.5%] mr-[9%] ml-[10%] text-left rounded">
                    <div className="py-[0.5%] pl-[0.5%] text-[19px] bg-p-light border-b border-gray-200">
                      <div>
                        <img
                          src={currentUser.avatarPath}
                          className="rounded-full"
                          width={43}
                          height={43}
                          alt={currentUser.name}
                        />
                        {currentUser.name}
                      </div>
                    </div>
                    <div className="bg-p-light p-[0.5%]">
                      <textarea
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                        placeholder="100文字以内"
                        rows={3}
                        maxLength={100}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                    </div>
                    <div className="py-[0.5%] pr-[2%] pl-[0.5%] bg-p-msg border-t border-gray-200">
                      <div className="text-right">
                        <button
                          type="submit"
                          className="rounded bg-p-gold px-3 py-1 hover:opacity-80"
                        >
                          コメント
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <p className="pt-[0.7%] pb-[1%] pl-[3%] text-[23px] text-white">
                  ログインしてください
                </p>
              )}
            </div>
          </div>

          {/* 関連画像 */}
          {matchTagGalleries.length > 0 && (
            <div className="mt-[5%] mb-[3%] bg-p-brand border border-p-dark rounded-[5px]">
              <div className="pt-[0.2%] pl-[1%] pb-[1%] text-[22px] text-white text-left">
                関連画像
              </div>
              <div className="flex flex-wrap justify-center m-0 w-full">
                {matchTagGalleries.map((g) => (
                  <div key={g.id} className="w-1/3 p-0 h-[37vh] border border-p-brand">
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
        <div className="w-full lg:w-3/12 pt-[0.5%] pr-[0.5%] pb-0 pl-[0.6%] m-0 bg-p-dark border border-p-brand rounded-[7px]">
          {/* 職人情報（投稿者が職人プロフィール未登録なら表示しない） */}
          {creator && (
            <div className="bg-[#eee] w-full min-h-[55vh] mb-[19vh] rounded-[7px]">
              <div className="bg-[#BAA9DA] mx-auto rounded-t-[7px] hover:opacity-80">
                <a href={`/page/creator/${creator.userId}`}>
                  <div className="w-full text-center">
                    <img
                      src={creator.avatarPath}
                      className="rounded-full"
                      width={180}
                      height={180}
                      alt="アバター"
                    />
                  </div>
                  <div className="pt-[13px] pb-2 text-center">
                    <h3 className="text-[33px]">{creator.name}</h3>
                  </div>
                </a>
              </div>
              <div className="border-2 border-[#D7CDE9] bg-p-light mt-[7%] rounded-[5px]">
                <div className="bg-[#BAA9DA] pt-[5%] pl-[2%] pb-0 text-[19px] rounded-t-[5px]">
                  創作作品名
                </div>
                <div className="text-center pt-[3%] pb-[4%] px-0">
                  <p className="text-[23px] p-0">{creator.title}</p>
                </div>
              </div>
              <div className="border-2 border-[#D7CDE9] bg-p-light mt-[7%] rounded-[5px]">
                <div className="bg-[#BAA9DA] pt-[5%] pl-[2%] pb-0 text-[19px] rounded-t-[5px]">
                  創業年数
                </div>
                <div className="text-center pt-[3%] pb-[4%] px-0">
                  <p className="text-[23px] p-0">{creator.establishment}年</p>
                </div>
              </div>
              <div className="border-2 border-[#D7CDE9] bg-p-light mt-[7%] rounded-[5px]">
                <div className="bg-[#BAA9DA] pt-[5%] pl-[2%] pb-0 text-[19px] rounded-t-[5px]">
                  従業員数
                </div>
                <div className="text-center pt-[3%] pb-[4%] px-0">
                  <p className="text-[23px] p-0">{creator.employee}人</p>
                </div>
              </div>
            </div>
          )}

          {/* その他の投稿 */}
          {otherGalleries.length > 0 && (
            <div className="p-[2%] bg-p-brand rounded-t-[5px]">
              <div className="text-[22px] text-white">その他の投稿</div>
              {otherGalleries.map((g) => (
                <div key={g.id} className="p-0 h-[37vh] border border-p-brand">
                  <a href={`/gallery/selected/${g.id}`}>
                    <img src={g.dataUrl} width="100%" height="100%" alt="その他の投稿" />
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
