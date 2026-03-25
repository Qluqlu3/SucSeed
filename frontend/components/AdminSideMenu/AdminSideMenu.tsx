// frontend/components/AdminSideMenu/AdminSideMenu.tsx
//
// 管理画面共通サイドメニュー。アクティブページを activeKey で指定する。

interface Props {
  activeKey?: string;
}

const NAV_ITEMS = [
  { key: 'user', label: 'ユーザー管理', href: '/admin/management/user' },
  { key: 'diary', label: '日記管理', href: '/admin/management/diary' },
  {
    key: 'diary_comment',
    label: '日記コメント',
    href: '/admin/management/diary_comment',
  },
  {
    key: 'gallery',
    label: 'ギャラリー管理',
    href: '/admin/management/gallery',
  },
  {
    key: 'inquiry',
    label: '問い合わせ管理',
    href: '/admin/management/inquiry',
  },
];

export const AdminSideMenu = ({ activeKey }: Props) => (
  <div className='col-2 admin-col-2'>
    <ul className='nav flex-column admin-side-menu'>
      {NAV_ITEMS.map((item, i) => {
        const isActive = item.key === activeKey;
        return (
          <li key={item.key} className={`nav-item${i === 0 ? ' admin-top-link' : ''}`}>
            <a href={item.href} className={`nav-link${isActive ? ' active disabled' : ''}`}>
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);
