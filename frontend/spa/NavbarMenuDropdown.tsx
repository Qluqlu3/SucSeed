import type { FC } from 'react';
import type { NavbarMenuItem } from './navbarMenu';

type NavbarMenuDropdownProps = {
  menuItems: NavbarMenuItem[];
};

export const NavbarMenuDropdown: FC<NavbarMenuDropdownProps> = ({ menuItems }) => (
  <li className='nav-item dropdown'>
    <button
      type='button'
      className='nav-link dropdown-toggle'
      id='navbarDropdown'
      data-toggle='dropdown'
      aria-haspopup='true'
      aria-expanded='false'
    >
      メニュー
    </button>
    <div className='dropdown-menu'>
      {menuItems.map((item) => (
        <a key={item.href} href={item.href} className='dropdown-item'>
          {item.label}
        </a>
      ))}
    </div>
  </li>
);
