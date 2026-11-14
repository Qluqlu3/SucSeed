'use client';

// web/lib/messages.ts
//
// メッセージ画面（web/app/message/**）で使う取得処理。

import type { MessagePartner } from '@sucseed/api';
import { type ApiResult, api, type Id, type MessageThread } from '@sucseed/api';
import { useEffect, useState } from 'react';
import { fetchAllPages, MAX_PER_PAGE } from './pagination';
import { isAuthError, redirectToLogin } from './session';

/** やり取りする相手の一覧（全件）。enabled になるまで取得しない。取得中は threads・error とも null */
export const useMessageThreads = (
  enabled: boolean,
): { threads: MessagePartner[] | null; error: string | null } => {
  const [threads, setThreads] = useState<MessagePartner[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let active = true;
    void fetchAllPages(api.messageThreads.index).then((result) => {
      if (!active) {
        return;
      }
      if (result.ok) {
        setThreads(result.data);
      } else if (isAuthError(result.error)) {
        redirectToLogin();
      } else {
        setError(result.error.message);
      }
    });
    return () => {
      active = false;
    };
  }, [enabled]);

  return { threads, error };
};

/**
 * 相手との履歴を全件、古い順で取る。Rails の画面は全件を出していたので揃える。
 * API は page=1 が直近のページで、ページ内は古い順。page を増やすとより古いページになる。
 */
export const fetchWholeThread = async (userId: Id): Promise<ApiResult<MessageThread>> => {
  const pages: MessageThread[] = [];
  for (let page = 1; ; page++) {
    const result = await api.messageThreads.show(userId, { page, perPage: MAX_PER_PAGE });
    if (!result.ok) {
      return result;
    }
    pages.push(result.data);
    if (page >= result.data.pagination.totalPages) {
      break;
    }
  }
  const newest = pages[0];
  const messages = [...pages].reverse().flatMap((thread) => thread.messages);
  return { ok: true, data: { ...newest, messages } };
};
