export const AppShell = () => {
  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <header className='border-b border-slate-200 px-6 py-4'>
        <div className='mx-auto max-w-6xl'>
          <p className='text-sm font-semibold tracking-wide text-slate-500 uppercase'>
            SucSeed SPA
          </p>
          <h1 className='mt-1 text-2xl font-bold'>アプリケーションシェル</h1>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-6 py-10'>
        <section className='rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
          <h2 className='text-lg font-semibold'>次の作業</h2>
          <p className='mt-2 text-sm leading-6 text-slate-600'>
            このシェルは、今後ルーティング、共通ナビゲーション、ログインモーダルの置き換え、そして
            Rails ERB が持っている共通レイアウト状態の受け皿になります。
          </p>
        </section>
      </main>
    </div>
  );
};
