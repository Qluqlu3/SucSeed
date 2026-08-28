// frontend/api/client.ts
//
// /api/v1 を叩くための薄いクライアント。
//
// Rails 側 (Api::BaseController) は失敗時に必ず
//   { error: { code, message, details } }
// を返すので、その形を前提に「成功か失敗か」を型で表現する。
// 呼び出し側が result.ok を見ないと data に触れないため、
// 「レスポンスを確認せずに楽観的に state を更新してしまう」事故を防げる。

import { getCsrfToken } from '../utils/csrf';

export interface ApiError {
  /** Rails 側の error.code。'network_error' はクライアント側で付与する */
  code: string;
  message: string;
  details: string[];
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

const NETWORK_ERROR: ApiError = {
  code: 'network_error',
  message: '通信に失敗しました。時間をおいて再度お試しください。',
  details: [],
};

const UNEXPECTED_ERROR: ApiError = {
  code: 'unexpected_error',
  message: '予期しないエラーが発生しました。',
  details: [],
};

// ログイン/ログアウトでセッションが張り替わると meta タグの CSRF トークンは古くなる。
// セッション API のレスポンスに含まれる csrfToken でここを更新する。
let overriddenCsrfToken: string | null = null;

export const setCsrfToken = (token: string): void => {
  overriddenCsrfToken = token;
};

const currentCsrfToken = (): string => overriddenCsrfToken ?? getCsrfToken();

const isApiError = (value: unknown): value is { error: ApiError } => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const error = (value as { error?: unknown }).error;
  return typeof error === 'object' && error !== null && 'code' in error;
};

const send = async <T>(method: string, path: string, init: RequestInit): Promise<ApiResult<T>> => {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      method,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(method === 'GET' ? {} : { 'X-CSRF-Token': currentCsrfToken() }),
        ...init.headers,
      },
    });
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }

  // 204 No Content はボディを持たない
  if (response.status === 204) {
    return { ok: true, data: undefined as T };
  }

  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return { ok: false, error: isApiError(json) ? json.error : UNEXPECTED_ERROR };
  }

  return { ok: true, data: json as T };
};

const request = <T>(method: string, path: string, body?: unknown): Promise<ApiResult<T>> =>
  send<T>(method, path, {
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

// 画像を伴うエンドポイント用。Content-Type はブラウザに boundary 付きで
// 設定させる必要があるため、こちらでは指定しない。
const requestForm = <T>(method: string, path: string, body: FormData): Promise<ApiResult<T>> =>
  send<T>(method, path, { body });

export const apiGet = <T>(path: string, query?: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  const queryString = params.toString();
  return request<T>('GET', queryString ? `${path}?${queryString}` : path);
};

export const apiPost = <T>(path: string, body?: unknown) => request<T>('POST', path, body);
export const apiPatch = <T>(path: string, body?: unknown) => request<T>('PATCH', path, body);
export const apiDelete = <T>(path: string, body?: unknown) => request<T>('DELETE', path, body);

export const apiPostForm = <T>(path: string, body: FormData) => requestForm<T>('POST', path, body);
export const apiPatchForm = <T>(path: string, body: FormData) =>
  requestForm<T>('PATCH', path, body);
