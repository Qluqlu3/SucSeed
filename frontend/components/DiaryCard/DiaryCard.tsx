// frontend/components/DiaryCard/DiaryCard.tsx
//
// 日記カード共通コンポーネント。
// DiarySelectPage / MyDiaryPage / YourDiaryPage / DiaryHeirFavoritePage で使い回す。
// いいね・コメント投稿・削除は /api/v1 の JSON API で処理するため
// ページ全体の再レンダリングが不要。
//
// entry の形は Rails の DiarySerializer と一対一で対応している
// （GET /api/v1/diaries が返す items の要素と同じ）。

import { MessageSquare, ThumbsUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Comment, DiaryFeedItem, Id } from '../../api';
import { api } from '../../api';

export type DiaryComment = Comment;
export type DiaryEntry = DiaryFeedItem;

interface Props {
  entry: DiaryEntry;
  currentUserId: Id | null;
  currentUserName: string | null;
  currentUserAvatar: string | null;
  canDelete?: boolean; // マイ日記は常に true
}

export const DiaryCard = ({
  entry,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  canDelete = false,
}: Props) => {
  const [goodCount, setGoodCount] = useState(entry.goodCount);
  const [myGood, setMyGood] = useState(entry.myGood);
  const [comments, setComments] = useState<DiaryComment[]>(entry.comments);
  const [commentText, setCommentText] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (deleted) return null;

  // いいね数はサーバーが返した値をそのまま採用する（クライアント側で ±1 しない）。
  const handleGood = async () => {
    setErrorMessage(null);
    const result = myGood
      ? await api.diaries.unlike(entry.diaryId)
      : await api.diaries.like(entry.diaryId);

    if (result.ok) {
      setMyGood(result.data.myGood);
      setGoodCount(result.data.goodCount);
    } else {
      setErrorMessage(result.error.message);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setErrorMessage(null);

    const result = await api.diaries.comment(entry.diaryId, commentText);
    if (result.ok) {
      // API が返した整形済みコメントをそのまま使う（日時書式がサーバーと揃う）
      setComments((prev) => [...prev, result.data.comment]);
      setCommentText('');
    } else {
      setErrorMessage(result.error.details[0] ?? result.error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この日記を削除してよいですか？')) return;
    setErrorMessage(null);

    const result = await api.diaries.destroy(entry.diaryId);
    if (result.ok) {
      setDeleted(true);
    } else {
      setErrorMessage(result.error.message);
    }
  };

  const isOwn = currentUserId === entry.userId;

  return (
    <div className="mt-[2%] border-2 border-[#D3C9E7] rounded-[5px]">
      {errorMessage && (
        <div className="mx-2 mt-2 rounded border border-red-400 bg-red-100 px-3 py-2 text-red-800">
          {errorMessage}
        </div>
      )}

      {/* カードヘッダー */}
      <div className="pt-[0.5%] pl-[0.8%] pb-[0.5%] rounded-t-[5px] bg-p-light text-[25px]">
        <img
          src={entry.avatarPath}
          className="rounded-full"
          width={60}
          height={60}
          alt={entry.name}
        />
        {entry.name}
      </div>

      {/* カードボディ */}
      <div className="pt-[0.3%] px-[0.5%] pb-[1.5%] bg-p-light">
        <div className="pr-[0.5%] text-right text-[17px] text-[#555]">{entry.postTime}</div>
        <div className="py-[1%] pl-[1%]">
          <p style={{ whiteSpace: 'pre-wrap' }} className="text-[21px]">
            {entry.content}
          </p>
        </div>
      </div>

      {/* カードフッター */}
      <div className="pt-[0.3%] pr-[1%] pb-[0.3%] rounded-b-[5px] bg-p-brand">
        <div className="text-right">
          {/* いいねアバター */}
          <div className="inline">
            {entry.goodAvatars.map((ga) => (
              <img
                key={ga.avatarPath}
                src={ga.avatarPath}
                className="rounded-full"
                width={30}
                height={30}
                alt="いいねしたユーザー"
              />
            ))}
          </div>

          {/* いいねボタン */}
          <button
            type="button"
            className={`rounded px-3 py-1 hover:text-black ${myGood ? 'bg-p-brand' : 'bg-p-gold'}`}
            onClick={handleGood}
            aria-pressed={myGood}
            aria-label={myGood ? 'いいねを取り消す' : 'いいねする'}
          >
            <ThumbsUp className="text-p-dark" size={21} />
            {goodCount}
          </button>

          {/* コメントトグルボタン */}
          <button
            type="button"
            className="rounded bg-p-gold px-3 py-1 hover:text-black"
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageSquare className="text-p-dark" size={21} />
            {comments.length}
          </button>

          {/* 削除ボタン（自分の投稿 or canDelete） */}
          {(isOwn || canDelete) && (
            <button
              type="button"
              className="rounded bg-p-gold px-3 py-1 hover:text-black"
              onClick={handleDelete}
            >
              <Trash2 className="text-p-danger" size={21} />
            </button>
          )}
        </div>

        {/* コメント一覧・投稿フォーム */}
        <div className={showComments ? 'block' : 'hidden'}>
          {comments.map((c) => (
            <div key={c.id} className="my-[1%] ml-[1%] bg-white rounded">
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

          {currentUserId ? (
            <form onSubmit={handleComment}>
              <div className="my-[1.5%] mr-[9%] ml-[10%] rounded bg-white">
                <div className="py-[0.5%] pl-[0.5%] text-[19px] bg-p-light border-b border-gray-200">
                  <div>
                    <img
                      src={currentUserAvatar ?? ''}
                      className="rounded-full"
                      width={43}
                      height={43}
                      alt={currentUserName ?? ''}
                    />
                    {currentUserName}
                  </div>
                </div>
                <div className="bg-p-light p-[0.5%]">
                  <textarea
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                    placeholder="100文字以内"
                    rows={2}
                    maxLength={100}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <div className="py-[0.5%] pr-[2%] pl-[0.5%] bg-p-msg border-t border-gray-200">
                  <div className="text-right">
                    <button
                      type="submit"
                      className="rounded bg-p-brand px-4 py-1 text-[19px] text-white hover:opacity-90"
                    >
                      コメント
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <p className="pt-[0.7%] pb-[1%] pl-[3%] text-[23px] text-white">ログインしてください</p>
          )}
        </div>
      </div>
    </div>
  );
};
