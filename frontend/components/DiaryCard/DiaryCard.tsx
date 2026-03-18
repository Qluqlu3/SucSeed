// frontend/components/DiaryCard/DiaryCard.tsx
//
// 日記カード共通コンポーネント。
// DiarySelectPage / MyDiaryPage / YourDiaryPage / DiaryHeirFavoritePage で使い回す。
// いいね・コメント投稿・削除は fetch API で処理するためページ全体の再レンダリングが不要。

import { useState } from 'react';

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

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
    await fetch(`/diary/show/${entry.diaryId}/good`, {
      method: 'POST',
      headers: { 'X-CSRF-Token': getCsrfToken() },
    });
    setMyGood(true);
    setGoodCount((c) => c + 1);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await fetch(`/diary/show/${entry.diaryId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
      },
      body: JSON.stringify({ diary_comment: { comment: commentText } }),
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
    await fetch(`/diary/post/${entry.diaryId}/delete`, {
      method: 'POST',
      headers: { 'X-CSRF-Token': getCsrfToken() },
    });
    setDeleted(true);
  };

  const isOwn = currentUserId === entry.userId;

  return (
    <div className="card diary-card">
      {/* カードヘッダー */}
      <div className="card-header diary-card-header">
        <img
          src={entry.avatarPath}
          className="rounded-circle"
          width={60}
          height={60}
          alt={entry.name}
        />
        {entry.name}
      </div>

      {/* カードボディ */}
      <div className="card-body diary-card-body">
        <div className="diary-time">{entry.postTime}</div>
        <div className="diary-content">
          <p style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</p>
        </div>
      </div>

      {/* カードフッター */}
      <div className="card-footer diary-card-footer">
        <div className="card-footer-btn">
          {/* いいねアバター */}
          <div className="good_user_box">
            {entry.goodAvatars.map((ga, i) => (
              <img
                key={i}
                src={ga.avatarPath}
                className="rounded-circle"
                width={30}
                height={30}
                alt="いいねしたユーザー"
              />
            ))}
          </div>

          {/* いいねボタン */}
          <button type="button" className="btn icon-btn" onClick={handleGood} disabled={myGood}>
            <i className="fas fa-thumbs-up thumbs-up-icon" />
            {goodCount}
          </button>

          {/* コメントトグルボタン */}
          <button
            type="button"
            className="btn icon-btn good-and-comment"
            data-toggle="collapse"
            data-target={`#diary-${entry.diaryId}`}
          >
            <i className="fas fa-comment-alt comment-icon" />
            {comments.length}
          </button>

          {/* 削除ボタン（自分の投稿 or canDelete） */}
          {(isOwn || canDelete) && (
            <button type="button" className="btn icon-btn" onClick={handleDelete}>
              <i className="fas fa-trash-alt trash-icon" />
            </button>
          )}
        </div>

        {/* コメント一覧・投稿フォーム */}
        <div className="collapse" id={`diary-${entry.diaryId}`}>
          {comments.map((c, i) => (
            <div key={i} className="card comment-card">
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

          {currentUserId ? (
            <form onSubmit={handleComment}>
              <div className="card input-comment-box">
                <div className="card-header input-comment-header">
                  <div className="input-comment-header-in">
                    <img
                      src={currentUserAvatar ?? ''}
                      className="rounded-circle"
                      width={43}
                      height={43}
                      alt={currentUserName ?? ''}
                    />
                    {currentUserName}
                  </div>
                </div>
                <div className="card-body input-comment-body">
                  <textarea
                    className="form-control"
                    placeholder="100文字以内"
                    rows={2}
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
    </div>
  );
};
