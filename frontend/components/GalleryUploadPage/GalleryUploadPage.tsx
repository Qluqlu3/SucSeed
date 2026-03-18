function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

interface Props {
  errors: string[];
}

export const GalleryUploadPage = ({ errors }: Props) => (
  <>
    <h1 className='main-title'>ギャラリー アップロード</h1>

    {errors.length > 0 && (
      <div className='alert alert-danger'>
        <ul>
          {errors.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    )}

    <div className='row justify-content-center'>
      <div className='col-md-4'>
        <div className='right-box'>
          <form action='/gallery/view' method='post' encType='multipart/form-data'>
            <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
            <div className='form-group'>
              <label>ファイルを選択する</label>
              <input
                type='file'
                name='gallery[data]'
                className='form-control-file'
                accept='image/jpg,image/jpeg,image/png'
              />
              <div className='tag-field'>
                <input
                  type='text'
                  name='gallery[tag_list]'
                  id='tagme'
                  placeholder='タグをカンマ区切りで入力'
                />
              </div>
              <div className='right_side'>
                <button type='submit' className='btn btn-primary btn-lg'>
                  登録
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
);
