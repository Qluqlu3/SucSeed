import { getCsrfToken } from '../../utils/csrf';
import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';
import { FlashMessages } from '../FlashMessages';

interface Props {
  galleries: GalleryItem[];
  errors: string[];
  flash: Record<string, string>;
}

export const FavoriteGalleryPage = ({ galleries, errors, flash }: Props) => (
  <>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>ギャラリー</h1>

    <FlashMessages flash={flash} />

    {errors.length > 0 && (
      <div className='alert alert-danger'>
        <ul>
          {errors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </div>
    )}

    <div className='min-h-screen'>
      <div className='row m-0 p-0'>
        <div className='col-md-9 p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]'>
          {galleries.length === 0 ? (
            <p className='mt-[10%] ml-[15%] text-[39px] text-white'>まだありません</p>
          ) : (
            <div className='row m-0 p-0'>
              {galleries.map((gallery) => (
                <GalleryCard key={gallery.id} gallery={gallery} />
              ))}
            </div>
          )}
        </div>

        <div className='col-sm-3 m-0 mb-[10%] px-[0.8%]'>
          <div className='bg-[#F7F5FB] rounded-[13px] max-h-[70vh] mt-[1vh]'>
            <form action='/gallery/view' method='post' encType='multipart/form-data'>
              <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
              <div className='form-group'>
                <div className='bg-p-brand rounded-t-[7px]'>
                  <label
                    className='block text-white text-[31px] mt-[1.5%] mb-[1%] ml-[5%]'
                    htmlFor='favorite-gallery-file'
                  >
                    投稿
                  </label>
                </div>
                <input
                  type='file'
                  id='favorite-gallery-file'
                  name='gallery[data]'
                  className='form-control-file mt-[3vh]'
                  accept='image/jpg,image/jpeg,image/png'
                />
                <label className='text-[16px] mt-[2vh] ml-[5%]' htmlFor='favorite-gallery-tags'>
                  タグ：
                </label>
                <div className='text-black mt-[1vh] ml-[5%]'>
                  <input
                    id='favorite-gallery-tags'
                    type='text'
                    name='gallery[tag_list]'
                    placeholder='タグを入力'
                  />
                </div>
                <div className='w-[90%] mx-auto mt-[8%]'>
                  <label className='form-input-label' htmlFor='favorite-gallery-comment'>
                    コメント：
                  </label>
                  <textarea
                    id='favorite-gallery-comment'
                    name='gallery[comment]'
                    className='form-control'
                    placeholder='100文字以内'
                    rows={3}
                  />
                </div>
                <div className='text-right mt-[7%] mr-[5%]'>
                  <button
                    type='submit'
                    className='btn btn-lg bg-p-brand text-white w-[33%] hover:opacity-80'
                  >
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
