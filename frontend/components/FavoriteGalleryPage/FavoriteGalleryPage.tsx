import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';
import { GalleryCard, type GalleryItem } from '../GalleryCard/GalleryCard';

interface Props {
  galleries: GalleryItem[];
  errors: string[];
  flash: Record<string, string>;
}

export const FavoriteGalleryPage = ({ galleries, errors, flash }: Props) => (
  <>
    <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">ギャラリー</h1>

    <FlashMessages flash={flash} />

    {errors.length > 0 && (
      <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
        <ul>
          {errors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="min-h-screen">
      <div className="flex flex-wrap m-0 p-0">
        <div className="w-full md:w-3/4 p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]">
          {galleries.length === 0 ? (
            <p className="mt-[10%] ml-[15%] text-[39px] text-white">まだありません</p>
          ) : (
            <div className="flex flex-wrap m-0 p-0">
              {galleries.map((gallery) => (
                <GalleryCard key={gallery.id} gallery={gallery} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/4 m-0 mb-[10%] px-[0.8%]">
          <div className="bg-[#F7F5FB] rounded-[13px] max-h-[70vh] mt-[1vh]">
            <form action="/gallery/view" method="post" encType="multipart/form-data">
              <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
              <div>
                <div className="bg-p-brand rounded-t-[7px]">
                  <label
                    className="block text-white text-[31px] mt-[1.5%] mb-[1%] ml-[5%]"
                    htmlFor="favorite-gallery-file"
                  >
                    投稿
                  </label>
                </div>
                <input
                  type="file"
                  id="favorite-gallery-file"
                  name="gallery[data]"
                  className="mt-[3vh] block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
                  accept="image/jpg,image/jpeg,image/png"
                />
                <label className="text-[16px] mt-[2vh] ml-[5%]" htmlFor="favorite-gallery-tags">
                  タグ：
                </label>
                <div className="text-black mt-[1vh] ml-[5%]">
                  <input
                    id="favorite-gallery-tags"
                    type="text"
                    name="gallery[tag_list]"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                    placeholder="タグを入力"
                  />
                </div>
                <div className="w-[90%] mx-auto mt-[8%]">
                  <label className="form-input-label" htmlFor="favorite-gallery-comment">
                    コメント：
                  </label>
                  <textarea
                    id="favorite-gallery-comment"
                    name="gallery[comment]"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                    placeholder="100文字以内"
                    rows={3}
                  />
                </div>
                <div className="text-right mt-[7%] mr-[5%]">
                  <button
                    type="submit"
                    className="rounded bg-p-brand px-5 py-2 text-lg text-white hover:opacity-80"
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
