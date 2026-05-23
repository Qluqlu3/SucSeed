// frontend/components/DiaryCard/DiaryCard.tsx
//
// 日記カード共通コンポーネント。
// DiarySelectPage / MyDiaryPage / YourDiaryPage / DiaryHeirFavoritePage で使い回す。
// いいね・コメント投稿・削除は fetch API で処理するためページ全体の再レンダリングが不要。

import { useState } from 'react';
import { postJson } from '../../utils/postJson';

export interface DiaryComment {
  name: string;
  avatarPath: string;
  comment: string;
  postTime: string;
}

export interface DiaryEntry {
  diaryId: number;
  userId: number;
  name: string;
  avatarPath: string;
  content: string;
  postTime: string;
  goodCount: number;
  goodAvatars: Array<{ avatarPath: string }>;
  myGood: boolean; // 閲覧者がすでにいいね済みか
  comments: DiaryComment[];
  commentCount: number;
}

interface Props {
  entry: DiaryEntry;
  currentUserId: number | null;
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

  if (deleted) return null;

  const handleGood = async () => {
    if (myGood) return;
    const res = await postJson(`/diary/show/${entry.diaryId}/good`);
    if (res.ok) {
      setMyGood(true);
      setGoodCount((c) => c + 1);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await postJson(`/diary/show/${entry.diaryId}/comment`, {
      diary_comment: { comment: commentText },
    });
    if (res.ok) {
      setComments((prev) => [
        ...prev,
        {
          name: currentUserName ?? '',
          avatarPath: currentUserAvatar ?? '',
          comment: commentText,
          postTime: new Date().toLocaleString('ja-JP'),
        },
      ]);
      setCommentText('');
    }
  };

  const handleDelete = async () => {
    await postJson(`/diary/post/${entry.diaryId}/delete`);
    setDeleted(true);
  };

  const isOwn = currentUserId === entry.userId;

  return (
    <div className='mt-[2%] border-2 border-[#D3C9E7] rounded-[5px]'>
      {/* カードヘッダー */}
      <div className='card-header pt-[0.5%] pl-[0.8%] pb-[0.5%] rounded-t-[5px] bg-[#FCF2D3] text-[25px]'>
        <img
          src={entry.avatarPath}
          className='rounded-circle'
          width={60}
          height={60}
          alt={entry.name}
        />
        {entry.name}
      </div>

      {/* カードボディ */}
      <div className='card-body pt-[0.3%] px-[0.5%] pb-[1.5%] bg-[#FCF2D3]'>
        <div className='pr-[0.5%] text-right text-[17px] text-[#555]'>{entry.postTime}</div>
        <div className='py-[1%] pl-[1%]'>
          <p style={{ whiteSpace: 'pre-wrap' }} className='text-[21px]'>
            {entry.content}
          </p>
        </div>
      </div>

      {/* カードフッター */}
      <div className='card-footer pt-[0.3%] pr-[1%] pb-[0.3%] rounded-b-[5px] bg-p-brand'>
        <div className='text-right'>
          {/* いいねアバター */}
          <div className='inline'>
            {entry.goodAvatars.map((ga) => (
              <img
                key={ga.avatarPath}
                src={ga.avatarPath}
                className='rounded-circle'
                width={30}
                height={30}
                alt='いいねしたユーザー'
              />
            ))}
          </div>

          {/* いいねボタン */}
          <button
            type='button'
            className='btn bg-[#FFA30D] hover:text-black'
            onClick={handleGood}
            disabled={myGood}
          >
            <i className='fas fa-thumbs-up text-[#1F8A70] text-[21px]' />
            {goodCount}
          </button>

          {/* コメントトグルボタン */}
          <button
            type='button'
            className='btn bg-[#FFA30D] hover:text-black good-and-comment'
            data-toggle='collapse'
            data-target={`#diary-${entry.diaryId}`}
          >
            <i className='fas fa-comment-alt text-[#1F8A70] text-[21px]' />
            {comments.length}
          </button>

          {/* 削除ボタン（自分の投稿 or canDelete） */}
          {(isOwn || canDelete) && (
            <button
              type='button'
              className='btn bg-[#FFA30D] hover:text-black'
              onClick={handleDelete}
            >
              <i className='fas fa-trash-alt text-[#FF0000] text-[21px]' />
            </button>
          )}
        </div>

        {/* コメント一覧・投稿フォーム */}
        <div className='collapse' id={`diary-${entry.diaryId}`}>
          {comments.map((c) => (
            <div key={`${c.postTime}-${c.name}`} className='card my-[1%] ml-[1%] bg-white'>
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

          {currentUserId ? (
            <form onSubmit={handleComment}>
              <div className='card my-[1.5%] mr-[9%] ml-[10%]'>
                <div className='card-header py-[0.5%] pl-[0.5%] text-[19px] bg-[#FCF2D3]'>
                  <div>
                    <img
                      src={currentUserAvatar ?? ''}
                      className='rounded-circle'
                      width={43}
                      height={43}
                      alt={currentUserName ?? ''}
                    />
                    {currentUserName}
                  </div>
                </div>
                <div className='card-body bg-[#FCF2D3] p-[0.5%]'>
                  <textarea
                    className='form-control'
                    placeholder='100文字以内'
                    rows={2}
                    maxLength={100}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <div className='card-footer py-[0.5%] pr-[2%] pl-[0.5%] bg-[#5cb85c]'>
                  <div className='text-right'>
                    <button
                      type='submit'
                      className='btn text-[19px] bg-p-brand text-white hover:opacity-90'
                    >
                      コメント
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <p className='pt-[0.7%] pb-[1%] pl-[3%] text-[23px] text-white'>ログインしてください</p>
          )}
        </div>
      </div>
    </div>
  );
};
