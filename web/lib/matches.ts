'use client';

// web/lib/matches.ts
//
// アピール/スカウト/マッチングの一覧画面（web/app/match/**）で共通の取得と変換。
// Rails の MatchController と同じく、一覧は全件を出す（API は全ページを読んで揃える）。

import type { ApiError, ApiResult, Collection, Match, PageParams } from '@sucseed/api';
import type { MatchListUser, Role } from '@sucseed/ui';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { redirectToLogin } from './session';

// API の1ページの上限
const PER_PAGE = 100;

export const isAuthError = (error: ApiError) =>
  error.code === 'unauthorized' || error.code === 'session_expired';

type FetchPage = (params: PageParams) => Promise<ApiResult<Collection<Match>>>;

const fetchAllPages = async (
  fetchPage: FetchPage,
): Promise<{ ok: true; matches: Match[] } | { ok: false; error: ApiError }> => {
  const matches: Match[] = [];
  for (let page = 1; ; page++) {
    const result = await fetchPage({ page, perPage: PER_PAGE });
    if (!result.ok) {
      return result;
    }
    matches.push(...result.data.items);
    const totalPages = result.data.pagination?.totalPages ?? 1;
    if (page >= totalPages) {
      return { ok: true, matches };
    }
  }
};

/**
 * 一覧を全件取得する。role が決まる（ログインを確認できる）まで取得しない。
 * 401 はログイン画面へ移す。取得中は matches・error とも null。
 * 回答した行を一覧から外せるよう setMatches も返す。
 */
export const useAllMatches = (
  role: Role | undefined,
  fetchPage: FetchPage,
): {
  matches: Match[] | null;
  setMatches: Dispatch<SetStateAction<Match[] | null>>;
  error: string | null;
} => {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // fetchPage は各画面でモジュールの定数として渡すので、依存は role だけで足りる
  // biome-ignore lint/correctness/useExhaustiveDependencies: 上記の通り
  useEffect(() => {
    if (!role) {
      return;
    }
    let active = true;
    void fetchAllPages(fetchPage).then((result) => {
      if (!active) {
        return;
      }
      if (result.ok) {
        setMatches(result.matches);
      } else if (isAuthError(result.error)) {
        redirectToLogin();
      } else {
        setError(result.error.message);
      }
    });
    return () => {
      active = false;
    };
  }, [role]);

  return { matches, setMatches, error };
};

/**
 * 一覧のカードに出す相手ユーザー。matches は向きが固定（heir / creator）なので、
 * 閲覧者が職人なら相手は後継者、それ以外なら職人。
 * 職人の屋号（title）は Rails と同じく出す画面だけで足す。
 */
export const toPartnerCard = (match: Match, role: Role): MatchListUser => {
  const partner = role === 'creator' ? match.heir : match.creator;
  return {
    pageId: String(partner.id),
    name: partner.name,
    birthday: partner.birthday,
    avatarPath: partner.avatarPath,
    matchTime: match.createdAt,
  };
};

/** 相手のプロフィールページ */
export const partnerProfilePath = (match: Match, role: Role): string =>
  role === 'creator' ? `/page/heir/${match.heirUserId}` : `/page/creator/${match.creatorUserId}`;
