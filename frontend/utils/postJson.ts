import { getCsrfToken } from './csrf';

/**
 * CSRF トークン付きの POST リクエストを送る薄いラッパー。
 * body を渡すと JSON シリアライズして送信する。
 */
export const postJson = (url: string, body?: unknown): Promise<Response> =>
  fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
