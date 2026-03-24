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
  <div className="row admin-row">
    <div className="col-2 admin-col-2">
      <ul className="nav flex-column admin-side-menu">
        {NAV_ITEMS.map((item, i) => (
          <li key={item.href} className={`nav-item${i === 0 ? ' admin-top-link' : ''}`}>
            <a href={item.href} className="nav-link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
    <div className="col-10 admin-col-9">
      <h1 className="admin-main-title">管理者トップ</h1>
    </div>
  </div>
);
