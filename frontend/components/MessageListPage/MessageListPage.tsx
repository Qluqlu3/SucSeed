// frontend/components/MessageListPage/MessageListPage.tsx
//
// /message/list ページの React コンポーネント。
// 左パネル: メッセージリスト（ボタンで履歴ページへ POST）。
// 右パネルは空（メッセージを選んでいない初期状態）。
//
// 【data-props】
//   messageLists: [{ id, name, avatarPath }]

import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface MessageListItem {
  id: string;
  name: string;
  avatarPath: string;
}

interface Props {
  messageLists: MessageListItem[];
  flash: Record<string, string>;
}

export const MessageListPage = ({ messageLists, flash }: Props) => (
  <div>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>メッセージ</h1>

    <FlashMessages flash={flash} />
    <div className='min-h-screen'>
      <div className='w-[90%] mx-auto bg-p-light border border-p-mid rounded-[7px]'>
        <div className='flex flex-wrap w-[90%] h-[67vh] mt-[1%] mb-[3%] mx-auto p-0 rounded-[5px] justify-center'>
          {/* 左パネル: メッセージリスト */}
          <div className='w-full md:w-5/12 h-[80vh] p-0 m-0 rounded-[5px]'>
            <div className='h-[65vh] bg-[#1F4B2E] rounded-[5px] overflow-scroll'>
              {messageLists.map((item) => (
                <form key={item.id} action={`/message/history/${item.id}`} method='post'>
                  <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                  <button type='submit' className='w-full h-[90px] bg-[#D3C9E7] hover:opacity-90'>
                    <div className='flex w-full h-[100px] m-0'>
                      <div className='w-3/12 p-0 m-0'>
                        <img
                          src={item.avatarPath}
                          width={80}
                          height={80}
                          className='rounded-full'
                          alt={item.name}
                        />
                      </div>
                      <div className='w-9/12 p-0 m-0 text-[25px] text-left leading-[80px]'>
                        {item.name}
                      </div>
                    </div>
                  </button>
                </form>
              ))}
            </div>
          </div>

          {/* 右パネル: 空（メッセージ未選択状態） */}
          <div className='w-full md:w-7/12 h-[65vh] p-0 m-0 rounded-[5px]'>
            <div className='h-[65vh] mx-auto bg-[#eee] rounded-[5px] overflow-scroll' />
          </div>
        </div>
      </div>
    </div>
  </div>
);
