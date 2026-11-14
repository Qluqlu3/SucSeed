// web/app/not-found.tsx
//
// 404。Rails の errors/error_404（frontend/components/Error404Page）と同じ表示。
// Next に無いパスは Rails へ中継される（next.config の fallback）ので、ここに来るのは
// 移した画面が notFound() を呼んだとき（API が 404 を返した ID など）だけ。

export default function NotFound() {
  return (
    <div>
      <h1 className="error-title error-page-title">エラーが発生しました</h1>
      <div className="error-page-box">
        <div className="error-btn-box">
          <a
            href="/index"
            className="inline-block rounded bg-gray-200 px-5 py-2 text-lg hover:opacity-80"
          >
            トップページ
          </a>
        </div>
      </div>
    </div>
  );
}
