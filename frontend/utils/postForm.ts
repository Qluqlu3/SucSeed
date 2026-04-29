import { getCsrfToken } from './csrf';

/**
 * CSRF トークン付きの POST リクエスト（FormData 用）を送る薄いラッパー。
 * multipart/form-data を Rails に送信する場合に使う。
 * JSON 送信には utils/postJson を使うこと。
 */
export const postForm = (url: string, body: FormData): Promise<Response> =>
  fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'X-CSRF-Token': getCsrfToken() },
    body,
  });
