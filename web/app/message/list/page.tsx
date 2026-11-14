'use client';

// web/app/message/list/page.tsx
//
// メッセージ一覧（相手を選ぶ前）。Rails の MessageController#view を置き換える。
// データは GET /api/v1/message_threads。右パネルは相手を選んでいない状態なので空。

import { useMessageThreads } from '../../../lib/messages';
import { useRequireLogin } from '../../../lib/session';
import { MessageFrame } from '../_components/MessageFrame';

export default function MessageListPage() {
  const session = useRequireLogin();
  const { threads, error } = useMessageThreads(session !== null);

  if (!session || (threads === null && error === null)) {
    return null;
  }

  return (
    <MessageFrame threads={threads ?? []} flash={error ? { danger: error } : {}}>
      <div className="h-[65vh] mx-auto bg-[#eee] rounded-[5px] overflow-scroll" />
    </MessageFrame>
  );
}
