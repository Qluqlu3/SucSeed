// frontend/components/DiaryPostPage/DiaryPostPage.tsx
//
// /diary/post ページ（日記投稿フォーム単体）の React コンポーネント。
// POST /diary/post へ送信。

import { getCsrfToken } from '../../utils/csrf';

interface Props {
  errors: string[];
  userName: string;
  avatarPath: string;
}

export const DiaryPostPage = ({ errors, userName, avatarPath }: Props) => {
  return (
    <>
      <h1>日記投稿</h1>

      {errors.length > 0 && (
        <div id='error_explanation' className='alert alert-danger'>
          <ul>
            {errors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className='panel panel-default diary-panel'>
        <div className='panel-heading diary-panel-header'>
          <h3 className='panel-title'>
            <img src={avatarPath} className='img-circle' width={50} height={50} alt={userName} />
            {userName}
          </h3>
        </div>

        <form action='/diary/post' method='post' encType='multipart/form-data'>
          <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
          <div className='panel-body main-panel'>
            <div className='form-group'>
              <textarea
                name='diary[content]'
                className='form-control'
                placeholder='文章など'
                rows={10}
              />
            </div>
          </div>
          <div className='panel-footer post-btn'>
            <button type='submit' className='btn btn-lg btn-primary'>
              投稿
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
