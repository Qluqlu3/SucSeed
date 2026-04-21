import type { FC } from 'react';
import { NavbarAuthAction } from './NavbarAuthAction';
import { NavbarMenuDropdown } from './NavbarMenuDropdown';
import { NavbarSearchForm } from './NavbarSearchForm';
import { getNavbarMenuItems } from './navbarMenu';
import type { ArtCategory, Role } from './session';

type NavbarProps = {
  role: Role;
  artCategories: ArtCategory[];
  logoSrc: string;
  titleSrc: string;
};

export const Navbar: FC<NavbarProps> = ({ role, artCategories, logoSrc, titleSrc }) => {
  const menuItems = getNavbarMenuItems(role);

  return (
    <nav className='navbar navbar-expand-lg my_nav index-nav'>
      <img src={logoSrc} className='logo' width='50' height='50' alt='ロゴ' />
      <a href='/index' className='navbar-brand my-brand'>
        <img src={titleSrc} width='150' alt='SucSeed' />
      </a>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'>
          <i className='fas fa-list mini-list' aria-hidden='true' />
        </span>
      </button>
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav mr-auto'>
          {menuItems && <NavbarMenuDropdown menuItems={menuItems} />}
          <NavbarSearchForm artCategories={artCategories} />
        </ul>
        <ul className='nav navbar-nav navbar-right'>
          <li className='login-ul'>
            <NavbarAuthAction role={role} />
          </li>
        </ul>
      </div>
    </nav>
  );
};
