// frontend/components/AdminIndexPage/AdminIndexPage.tsx
//
// /admin/index ページの React コンポーネント。
// サイドメニュー + 管理者トップ見出しのみ。
//
// 【data-props】なし（props なし）

const NAV_ITEMS = [
  { label: 'ユーザー管理', href: '/admin/management/user' },
  { label: '日記管理', href: '/admin/management/diary' },
  { label: '日記コメント', href: '/admin/management/diary_comment' },
  { label: 'ギャラリー管理', href: '/admin/management/gallery' },
  { label: '問い合わせ管理', href: '/admin/management/inquiry' },
];

export const AdminIndexPage = () => (
  <div className='w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap'>
    <div className='w-full lg:w-2/12 h-screen bg-[#CCC] overflow-x-scroll overflow-y-scroll'>
      <ul className='flex flex-col ml-[13%]'>
        {NAV_ITEMS.map((item, i) => (
          <li key={item.href} className={`${i === 0 ? 'mt-[27%]' : ''}`}>
            <a href={item.href} className='block py-1 text-gray-700 hover:text-p-brand'>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
    <div className='w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll'>
      <h1 className='text-center text-[60px]'>管理者トップ</h1>
    </div>
  </div>
);
