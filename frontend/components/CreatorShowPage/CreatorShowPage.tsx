// frontend/components/CreatorShowPage/CreatorShowPage.tsx
//
// /creator/show ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   creator : { title, categoryName, establishment, employee,
//               postalCode, isRecruitment }
//   isCreator : 職人セッションかどうか（設定ドロップダウンの出し分けに使用）

// ── 型定義 ──────────────────────────────────────────────────────────
import { FlashMessages } from '../FlashMessages';

interface CreatorDetail {
  title: string;
  categoryName: string;
  establishment: number;
  employee: number;
  postalCode: string;
  isRecruitment: boolean;
}

interface Props {
  creator: CreatorDetail;
  isCreator: boolean;
  flash: Record<string, string>;
}

// ── コンポーネント ───────────────────────────────────────────────────

export const CreatorShowPage = ({ creator, isCreator, flash }: Props) => (
  <div>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>制作者情報</h1>

    <FlashMessages flash={flash} />
    <div className='min-h-screen'>
      <div className='w-[85%] mx-auto mb-[5%] bg-p-light border border-p-mid rounded-[7px]'>
        {/* 編集メニュー */}
        <div className='relative'>
          <button
            type='button'
            className='rounded bg-white border border-gray-300 px-3 py-2 hover:opacity-80'
            id='dropdownMenu1'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='true'
          >
            <i className='fas fa-cog text-[50px]' />
          </button>
          <ul
            className='absolute right-0 z-10 mt-1 w-48 rounded bg-white shadow-lg border border-gray-200'
            aria-labelledby='dropdownMenu1'
          >
            <li className='setting-item'>
              <a href='/my_page/my_page' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                プロフィール一覧
              </a>
            </li>
            <li className='setting-item'>
              <a href='/my_page/update' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                プロフィール変更
              </a>
            </li>
            {isCreator ? (
              <>
                <li className='setting-item'>
                  <a href='/creator/show' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                    プロフィール詳細
                  </a>
                </li>
                <li className='setting-item'>
                  <a href='/creator/edit' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                    プロフィール詳細変更
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className='setting-item'>
                  <a href='/heir/show' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                    プロフィール詳細
                  </a>
                </li>
                <li className='setting-item'>
                  <a href='/heir/edit' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                    プロフィール詳細変更
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-[8px]'>
          <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
            工芸名
          </div>
          <div className='text-[27px] py-[2%] bg-white text-center'>{creator.title}</div>
        </div>

        <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-[8px]'>
          <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
            工芸カテゴリー
          </div>
          <div className='text-[27px] py-[2%] bg-white text-center'>{creator.categoryName}</div>
        </div>

        <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-[8px]'>
          <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
            創業年数
          </div>
          <div className='text-[27px] py-[2%] bg-white text-center'>{creator.establishment}年</div>
        </div>

        <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-[8px]'>
          <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
            従業員数
          </div>
          <div className='text-[27px] py-[2%] bg-white text-center'>{creator.employee}人</div>
        </div>

        <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-[8px]'>
          <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
            作業所郵便番号
          </div>
          <div className='text-[27px] py-[2%] bg-white text-center'>{creator.postalCode}</div>
        </div>

        <div className='min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-[8px]'>
          <div className='pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand'>
            募集チェック
          </div>
          <div className='text-[27px] py-[2%] bg-white text-center'>
            <p>{creator.isRecruitment ? '募集中' : '募集停止中'}</p>
          </div>
        </div>

        <div className='pb-[5%] mb-[7%]' />
      </div>
    </div>
  </div>
);
