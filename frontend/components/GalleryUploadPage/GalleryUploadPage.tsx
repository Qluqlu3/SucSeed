import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface Props {
  errors: string[];
  flash: Record<string, string>;
}

export const GalleryUploadPage = ({ errors, flash }: Props) => (
  <>
    <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
      ギャラリー アップロード
    </h1>

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

    <div className="flex flex-wrap justify-center">
      <div className="w-full md:w-1/3">
        <div className="right-box bg-[#F7F5FB] rounded-[13px] max-h-[70vh] mt-[1vh]">
          <form action="/gallery/view" method="post" encType="multipart/form-data">
            <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
            <div>
              <label htmlFor="gallery-upload-file">ファイルを選択する</label>
              <input
                type="file"
                id="gallery-upload-file"
                name="gallery[data]"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
                accept="image/jpg,image/jpeg,image/png"
              />
              <div className="text-black mt-[1vh] ml-[5%]">
                <input
                  type="text"
                  name="gallery[tag_list]"
                  id="tagme"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                  placeholder="タグをカンマ区切りで入力"
                />
              </div>
              <div className="mt-[5vh] mr-[3%] text-right">
                <button
                  type="submit"
                  className="rounded bg-p-brand px-5 py-2 text-lg text-white hover:opacity-80"
                >
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
