// frontend/components/MessageListPage/MessageListPage.tsx
//
// /message/list ページの React コンポーネント。
// 左パネル: メッセージリスト（ボタンで履歴ページへ POST）。
// 右パネルは空（メッセージを選んでいない初期状態）。
//
// 【data-props】
//   messageLists: [{ id, name, avatarPath }]

interface MessageListItem {
  id: string;
  name: string;
  avatarPath: string;
}

interface Props {
  messageLists: MessageListItem[];
}

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

export const MessageListPage = ({ messageLists }: Props) => (
  <div>
    <h1 className="main-title">メッセージ</h1>
    <div className="all-cover-box">
      <div className="wrapper">
        <div className="row my-row justify-content-center">
          {/* 左パネル: メッセージリスト */}
          <div className="col-md-5 my-col-left">
            <div className="list-box">
              {messageLists.map((item) => (
                <form key={item.id} action={`/message/history/${item.id}`} method="post">
                  <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
                  <button type="submit" className="btn message-list-btn">
                    <div className="message-list-box row my-list-row">
                      <div className="col-md-3 col-avatar-box">
                        <img
                          src={item.avatarPath}
                          width={80}
                          height={80}
                          className="rounded-circle"
                          alt={item.name}
                        />
                      </div>
                      <div className="col-md-9 col-name-box">{item.name}</div>
                    </div>
                  </button>
                </form>
              ))}
            </div>
          </div>

          {/* 右パネル: 空（メッセージ未選択状態） */}
          <div className="col-md-7 my-col-right">
            <div className="message-box" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
