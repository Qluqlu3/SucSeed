// frontend/components/MyDiaryPage/MyDiaryPage.tsx
//
// /diary/my_diary ページ（マイ日記）の React コンポーネント。
// 右コラムに投稿フォームを持ち、投稿後に fetch で日記を追加する。

import { useState } from 'react';
import { DiaryCard, type DiaryEntry } from '../DiaryCard/DiaryCard';

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

interface CurrentUser {
  id: number;
  name: string;
  avatarPath: string;
}

interface Props {
  diaries: DiaryEntry[];
  errors: string[];
  currentUser: CurrentUser;
}

export const MyDiaryPage = ({ diaries: initialDiaries, errors, currentUser }: Props) => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>(initialDiaries);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || posting) return;
    setPosting(true);
    const body = new FormData();
    body.append('diary[content]', content);
    body.append('diary[user_id]', String(currentUser.id));
    const res = await fetch('/diary/post', {
      method: 'POST',
      headers: { 'X-CSRF-Token': getCsrfToken() },
      body,
    });
    if (res.redirected || res.ok) {
      const tempId = Date.now();
      setDiaries((prev) => [
        {
          diaryId: tempId,
          userId: currentUser.id,
          name: currentUser.name,
          avatarPath: currentUser.avatarPath,
          content,
          postTime: new Date().toLocaleString('ja-JP'),
          goodCount: 0,
          goodAvatars: [],
          myGood: false,
          comments: [],
          commentCount: 0,
        },
        ...prev,
      ]);
      setContent('');
    }
    setPosting(false);
  };

  return (
    <>
      <h1 className='main-title'>マイ日記</h1>

      {errors.length > 0 && (
        <div id='error_explanation' className='error-box'>
          <p className='error-title'>入力内容にエラーが{errors.length}件あります</p>
          <ul className='error-index'>
            {errors.map((msg, i) => (
              <li key={i} className='error-content'>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='wrapper'>
        <div className='row my-row'>
          {/* 左カラム：日記一覧 */}
          <div className='col-md-9 left-col'>
            {diaries.length === 0 ? (
              <p className='empty-text'>まだありません</p>
            ) : (
              diaries.map((entry) => (
                <DiaryCard
                  key={entry.diaryId}
                  entry={entry}
                  currentUserId={currentUser.id}
                  currentUserName={currentUser.name}
                  currentUserAvatar={currentUser.avatarPath}
                  canDelete={true}
                />
              ))
            )}
          </div>

          {/* 右カラム：投稿フォーム */}
          <div className='col-md-3 right-col'>
            <div className='in-box'>
              <div className='card diary-post-card'>
                <div className='diary-post-card-header'>
                  <img
                    src={currentUser.avatarPath}
                    className='rounded-circle'
                    width={60}
                    height={60}
                    alt={currentUser.name}
                  />
                  {currentUser.name}
                </div>
                <form onSubmit={handlePost}>
                  <div className='diary-post-card-body'>
                    <textarea
                      className='form-control'
                      placeholder='文章など'
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className='diary-post-card-footer post-btn'>
                    <button
                      type='submit'
                      className='btn btn-default btn-lg my-btn'
                      disabled={posting}
                    >
                      投稿
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
