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

import { Send } from 'lucide-react';
import { useEffect, useRef } from 'react';
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

export const MessagePage = ({ messageLists, messageHistory, fromUser, toUser, flash }: Props) => {
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, []);

  return (
    <div>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">メッセージ</h1>

      <FlashMessages flash={flash} />
      <div className="min-h-screen">
        <div className="w-[90%] mx-auto bg-p-light border border-p-mid rounded-[7px]">
          <div className="flex flex-wrap w-[90%] h-[67vh] mt-[1%] mb-[3%] mx-auto p-0 rounded-[5px] justify-center">
            {/* 左パネル: メッセージリスト */}
            <div className="w-full md:w-5/12 h-[80vh] p-0 m-0 rounded-[5px]">
              <div className="h-[65vh] bg-p-dark rounded-[5px] overflow-scroll">
                {messageLists.map((item) => (
                  <form key={item.id} action={`/message/history/${item.id}`} method="post">
                    <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
                    <button type="submit" className="w-full h-[90px] bg-[#D3C9E7] text-left">
                      <div className="flex w-full h-[100px] m-0">
                        <div className="w-3/12 p-0 m-0">
                          <img
                            src={item.avatarPath}
                            width={80}
                            height={80}
                            className="rounded-full"
                            alt={item.name}
                          />
                        </div>
                        <div className="w-9/12 p-0 m-0 text-[25px] text-left leading-[80px]">
                          {item.name}
                        </div>
                      </div>
                    </button>
                  </form>
                ))}
              </div>
            </div>

            {/* 右パネル: 履歴 + 送信フォーム */}
            <div className="w-full md:w-7/12 h-[65vh] p-0 m-0 rounded-[5px]">
              <div
                ref={historyRef}
                className="h-[65vh] mx-auto bg-[#eee] rounded-[5px] overflow-scroll"
              >
                <h3 className="py-[3px] px-2 bg-p-msg">{toUser.name}さん</h3>
                {messageHistory.map((msg) =>
                  msg.sendUserId === fromUser.id ? (
                    // 自分の発言
                    <div key={`${msg.sendUserId}-${msg.createdAt}`} className="mt-2 text-right">
                      <div className="flex items-end justify-end gap-2">
                        <p className="p-[7px] text-[17px] [border-radius:17px_17px_0_17px] bg-p-mid inline-block">
                          {msg.content}
                        </p>
                        <img
                          src={fromUser.avatarPath}
                          width={60}
                          height={60}
                          className="shrink-0 rounded-full"
                          alt=""
                        />
                      </div>
                      <p className="px-[5px] text-[13px] text-[#aaa]">{msg.createdAt}</p>
                    </div>
                  ) : (
                    // 相手の発言
                    <div key={`${msg.sendUserId}-${msg.createdAt}`} className="mt-2 text-left">
                      <div className="flex items-end gap-2">
                        <img
                          src={toUser.avatarPath}
                          width={60}
                          height={60}
                          className="shrink-0 rounded-full"
                          alt={toUser.name}
                        />
                        <p className="p-[7px] text-[17px] [border-radius:17px_17px_17px_0] bg-p-list inline-block">
                          {msg.content}
                        </p>
                      </div>
                      <p className="px-[5px] text-[13px] text-[#aaa]">{msg.createdAt}</p>
                    </div>
                  ),
                )}
              </div>

              {/* 送信フォーム */}
              <div>
                <form action={`/message/send/${toUser.id}`} method="post" className="w-full">
                  <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      name="message[content]"
                      className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
                      placeholder="メッセージ"
                      maxLength={1000}
                    />
                    <button
                      type="submit"
                      className="flex w-[5vw] items-center justify-center rounded bg-p-gold text-white hover:opacity-80"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
