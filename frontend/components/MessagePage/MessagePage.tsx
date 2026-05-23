// frontend/components/MessagePage/MessagePage.tsx
//
// /message/history/:id ページの React コンポーネント。
// 左パネル: メッセージリスト、右パネル: 選択相手との履歴 + 送信フォーム。
//
// 【data-props】
//   messageLists    : [{ id, name, avatarPath }]
//   messageHistory  : [{ sendUserId, content, createdAt }]
//   fromUser        : { id, avatarPath }
//   toUser          : { id, name, avatarPath }

import { getCsrfToken } from '../../utils/csrf';
import { FlashMessages } from '../FlashMessages';

interface MessageListItem {
  id: string;
  name: string;
  avatarPath: string;
}

interface MessageHistoryItem {
  sendUserId: string;
  content: string;
  createdAt: string;
}

interface UserInfo {
  id: string;
  avatarPath: string;
  name: string;
}

interface Props {
  messageLists: MessageListItem[];
  messageHistory: MessageHistoryItem[];
  fromUser: UserInfo;
  toUser: UserInfo;
  flash: Record<string, string>;
}

export const MessagePage = ({ messageLists, messageHistory, fromUser, toUser, flash }: Props) => (
  <div>
    <h1 className='mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand'>メッセージ</h1>

    <FlashMessages flash={flash} />
    <div className='min-h-screen'>
      <div className='w-[90%] mx-auto bg-p-light border border-p-mid rounded-[7px]'>
        <div className='row w-[90%] h-[67vh] mt-[1%] mb-[3%] mx-auto p-0 rounded-[5px] justify-content-center'>
          {/* 左パネル: メッセージリスト */}
          <div className='col-md-5 h-[80vh] p-0 m-0 rounded-[5px]'>
            <div className='h-[65vh] bg-[#1F4B2E] rounded-[5px] overflow-scroll'>
              {messageLists.map((item) => (
                <form key={item.id} action={`/message/history/${item.id}`} method='post'>
                  <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                  <button type='submit' className='btn w-full h-[90px] bg-[#D3C9E7]'>
                    <div className='row w-full h-[100px] m-0'>
                      <div className='col-md-3 p-0 m-0'>
                        <img
                          src={item.avatarPath}
                          width={80}
                          height={80}
                          className='rounded-circle'
                          alt={item.name}
                        />
                      </div>
                      <div className='col-md-9 p-0 m-0 text-[25px] text-left leading-[80px]'>
                        {item.name}
                      </div>
                    </div>
                  </button>
                </form>
              ))}
            </div>
          </div>

          {/* 右パネル: 履歴 + 送信フォーム */}
          <div className='col-md-7 h-[65vh] p-0 m-0 rounded-[5px]'>
            <div className='h-[65vh] mx-auto bg-[#eee] rounded-[5px] overflow-scroll'>
              <h3 className='py-[3px] px-2 bg-[#5cb85c]'>{toUser.name}さん</h3>
              {messageHistory.map((msg) =>
                msg.sendUserId === fromUser.id ? (
                  // 自分の発言
                  <div key={`${msg.sendUserId}-${msg.createdAt}`} className='mt-2 text-right'>
                    <div className='media text-right'>
                      <div className='media-body'>
                        <p className='p-[7px] text-[17px] [border-radius:17px_17px_0_17px] bg-[#A3CAFF] inline-block'>
                          {msg.content}
                        </p>
                      </div>
                      <img
                        src={fromUser.avatarPath}
                        width={60}
                        height={60}
                        className='rounded-circle'
                        alt=''
                      />
                    </div>
                    <p className='px-[5px] text-[13px] text-[#aaa]'>{msg.createdAt}</p>
                  </div>
                ) : (
                  // 相手の発言
                  <div key={`${msg.sendUserId}-${msg.createdAt}`} className='mt-2 text-left'>
                    <div className='media text-left'>
                      <img
                        src={toUser.avatarPath}
                        width={60}
                        height={60}
                        className='rounded-circle'
                        alt={toUser.name}
                      />
                      <div className='media-body'>
                        <p className='p-[7px] text-[17px] [border-radius:17px_17px_17px_0] bg-[#3D91FF] inline-block'>
                          {msg.content}
                        </p>
                      </div>
                    </div>
                    <p className='px-[5px] text-[13px] text-[#aaa]'>{msg.createdAt}</p>
                  </div>
                ),
              )}
            </div>

            {/* 送信フォーム */}
            <div>
              <form action={`/message/send/${toUser.id}`} method='post' className='form-control'>
                <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                <div className='input-group'>
                  <input
                    type='text'
                    name='message[content]'
                    className='form-control'
                    placeholder='メッセージ'
                  />
                  <span className='input-group-btn'>
                    <button type='submit' className='btn p-0 w-[5vw] text-[23px] bg-[#FFA30D]'>
                      <i className='far fa-paper-plane message-icon' />
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
