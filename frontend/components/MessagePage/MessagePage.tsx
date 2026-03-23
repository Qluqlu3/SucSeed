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
}

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

export const MessagePage = ({ messageLists, messageHistory, fromUser, toUser }: Props) => (
  <div>
    <h1 className='main-title'>メッセージ</h1>
    <div className='all-cover-box'>
      <div className='wrapper'>
        <div className='row my-row justify-content-center'>
          {/* 左パネル: メッセージリスト */}
          <div className='col-md-5 my-col-left'>
            <div className='list-box'>
              {messageLists.map((item) => (
                <form key={item.id} action={`/message/history/${item.id}`} method='post'>
                  <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
                  <button type='submit' className='btn message-list-btn'>
                    <div className='message-list-box row my-list-row'>
                      <div className='col-md-3 col-avatar-box'>
                        <img
                          src={item.avatarPath}
                          width={80}
                          height={80}
                          className='rounded-circle'
                          alt={item.name}
                        />
                      </div>
                      <div className='col-md-9 col-name-box'>{item.name}</div>
                    </div>
                  </button>
                </form>
              ))}
            </div>
          </div>

          {/* 右パネル: 履歴 + 送信フォーム */}
          <div className='col-md-7 my-col-right'>
            <div className='message-box'>
              <h3 className='message-title'>{toUser.name}さん</h3>
              {messageHistory.map((msg, idx) =>
                msg.sendUserId === fromUser.id ? (
                  // 自分の発言
                  <div key={`${msg.createdAt}-${idx}`} className='from-message-box text-right'>
                    <div className='media text-right'>
                      <div className='media-body from-message-content'>
                        <p>{msg.content}</p>
                      </div>
                      <img
                        src={fromUser.avatarPath}
                        width={60}
                        height={60}
                        className='rounded-circle'
                        alt=''
                      />
                    </div>
                    <p className='message-time-text'>{msg.createdAt}</p>
                  </div>
                ) : (
                  // 相手の発言
                  <div key={`${msg.createdAt}-${idx}`} className='to-message-box text-left'>
                    <div className='media text-left'>
                      <img
                        src={toUser.avatarPath}
                        width={60}
                        height={60}
                        className='rounded-circle'
                        alt={toUser.name}
                      />
                      <div className='media-body to-message-content'>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                    <p className='message-time-text'>{msg.createdAt}</p>
                  </div>
                ),
              )}
            </div>

            {/* 送信フォーム */}
            <div className='send-message-box'>
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
                    <button type='submit' className='btn send-btn'>
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
