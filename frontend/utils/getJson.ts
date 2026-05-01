/**
 * 認証情報付きの GET リクエストを送る薄いラッパー。
 * JSON レスポンスを期待するエンドポイントに使う。
 * POST 送信には utils/postJson / utils/postForm を使うこと。
 */
export const getJson = (url: string): Promise<Response> =>
  fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
