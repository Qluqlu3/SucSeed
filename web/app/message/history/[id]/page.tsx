'use client';

// web/app/message/history/[id]/page.tsx
//
// :id の相手とのメッセージ。Rails の MessageController#get_history と send_message を置き換える。
// 履歴は GET /api/v1/message_threads/:id、送信は POST /api/v1/message_threads/:id/messages。
//
// Rails は送信後に同じ画面へリダイレクトしていたが、ここでは読み直さずに送ったメッセージを
// 履歴の末尾に足す。相手が存在しなければ（API が 404）、Rails と同じく 404 の画面を出す。

import { api, type Message, type MessageThread } from '@sucseed/api';
import type { Flash } from '@sucseed/ui';
import { Send } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { fetchWholeThread, useMessageThreads } from '../../../../lib/messages';
import { isAuthError, redirectToLogin, useRequireLogin } from '../../../../lib/session';
import { MessageFrame } from '../../_components/MessageFrame';

// Rails の flash（t('flash.danger.error')）と同じ文言
const FAILED = 'エラーが発生しました';

type ThreadState =
  | { status: 'loading' }
  | { status: 'loaded'; thread: MessageThread; myAvatarPath: string }
  | { status: 'not_found' }
  | { status: 'error'; message: string };

const MessageBubble = ({
  message,
  avatarPath,
  partnerName,
}: {
  message: Message;
  avatarPath: string;
  partnerName: string;
}) =>
  message.mine ? (
    // 自分の発言
    <div className="mt-2 text-right">
      <div className="flex items-end justify-end gap-2">
        <p className="p-[7px] text-[17px] [border-radius:17px_17px_0_17px] bg-p-mid inline-block">
          {message.content}
        </p>
        {/* biome-ignore lint/performance/noImgElement: アップロード画像は Rails から中継して配るので next/image を通さない */}
        <img src={avatarPath} width={60} height={60} className="shrink-0 rounded-full" alt="" />
      </div>
      <p className="px-[5px] text-[13px] text-[#aaa]">{message.createdAt}</p>
    </div>
  ) : (
    // 相手の発言
    <div className="mt-2 text-left">
      <div className="flex items-end gap-2">
        {/* biome-ignore lint/performance/noImgElement: アップロード画像は Rails から中継して配るので next/image を通さない */}
        <img
          src={avatarPath}
          width={60}
          height={60}
          className="shrink-0 rounded-full"
          alt={partnerName}
        />
        <p className="p-[7px] text-[17px] [border-radius:17px_17px_17px_0] bg-p-list inline-block">
          {message.content}
        </p>
      </div>
      <p className="px-[5px] text-[13px] text-[#aaa]">{message.createdAt}</p>
    </div>
  );

const SendForm = ({ onSend }: { onSend: (content: string) => Promise<boolean> }) => {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    const sent = await onSend(content);
    setSending(false);
    // 失敗したときは入力を残す（Rails は画面ごと読み直すので消えていた）
    if (sent) {
      setContent('');
    }
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex w-full gap-2">
        <input
          type="text"
          name="message[content]"
          className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
          placeholder="メッセージ"
          maxLength={1000}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <button
          type="submit"
          className="flex w-[5vw] items-center justify-center rounded bg-p-gold text-white hover:opacity-80"
          disabled={sending}
          aria-label="送信"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default function MessageHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const session = useRequireLogin();
  const loggedIn = session !== null;
  const { threads, error: threadsError } = useMessageThreads(loggedIn);
  const [state, setState] = useState<ThreadState>({ status: 'loading' });
  const [flash, setFlash] = useState<Flash>({});
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }
    let active = true;
    setState({ status: 'loading' });
    setFlash({});
    void Promise.all([fetchWholeThread(id), api.profile.show()]).then(([thread, profile]) => {
      if (!active) {
        return;
      }
      const failed = !thread.ok ? thread.error : !profile.ok ? profile.error : null;
      if (failed) {
        if (isAuthError(failed)) {
          redirectToLogin();
        } else if (failed.code === 'not_found') {
          setState({ status: 'not_found' });
        } else {
          setState({ status: 'error', message: failed.message });
        }
        return;
      }
      if (thread.ok && profile.ok) {
        setState({ status: 'loaded', thread: thread.data, myAvatarPath: profile.data.avatarPath });
      }
    });
    return () => {
      active = false;
    };
  }, [id, loggedIn]);

  // 取得中は見出しも出さない（Rails の画面はサーバー側で描画済みだったので、空の状態を見せない）
  const ready =
    session !== null && state.status !== 'loading' && (threads !== null || threadsError !== null);
  const messageCount = state.status === 'loaded' ? state.thread.messages.length : 0;

  // Rails と同じく、最下部（最新）までスクロールした状態にする。送信して増えたときも同じ
  // biome-ignore lint/correctness/useExhaustiveDependencies: 表示されたとき・件数が変わったときに動かすための依存
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [ready, messageCount]);

  if (state.status === 'not_found') {
    notFound();
  }

  if (!ready) {
    return null;
  }

  const send = async (content: string): Promise<boolean> => {
    const result = await api.messageThreads.sendMessage(id, content);
    if (!result.ok) {
      if (isAuthError(result.error)) {
        redirectToLogin();
      } else {
        setFlash({ danger: FAILED });
      }
      return false;
    }
    setFlash({});
    setState((current) =>
      current.status === 'loaded'
        ? {
            ...current,
            thread: { ...current.thread, messages: [...current.thread.messages, result.data] },
          }
        : current,
    );
    return true;
  };

  const pageError = threadsError ?? (state.status === 'error' ? state.message : null);

  return (
    <MessageFrame threads={threads ?? []} flash={pageError ? { danger: pageError } : flash}>
      {state.status === 'loaded' && (
        <>
          <div
            ref={historyRef}
            className="h-[65vh] mx-auto bg-[#eee] rounded-[5px] overflow-scroll"
          >
            <h3 className="py-[3px] px-2 bg-p-msg">{state.thread.partner.name}さん</h3>
            {state.thread.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                avatarPath={message.mine ? state.myAvatarPath : state.thread.partner.avatarPath}
                partnerName={state.thread.partner.name}
              />
            ))}
          </div>
          <SendForm onSend={send} />
        </>
      )}
    </MessageFrame>
  );
}
