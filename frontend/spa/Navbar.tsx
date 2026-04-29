import type { FC } from 'react';
import { NavbarAuthAction } from './NavbarAuthAction';
import { NavbarBrand } from './NavbarBrand';
import { NavbarMenuDropdown } from './NavbarMenuDropdown';
import { NavbarSearchForm } from './NavbarSearchForm';
import { NavbarToggleButton } from './NavbarToggleButton';
import { getNavbarMenuItems } from './navbarMenu';
import type { ArtCategory, Role } from './sessionTypes';

type NavbarProps = {
  role: Role;
  artCategories: ArtCategory[];
  logoSrc: string;
  titleSrc: string;
};

export const Navbar: FC<NavbarProps> = ({ role, artCategories, logoSrc, titleSrc }) => {
  const menuItems = getNavbarMenuItems(role);

  return (
    <nav className="navbar navbar-expand-lg my_nav index-nav">
      <NavbarBrand logoSrc={logoSrc} titleSrc={titleSrc} />
      <NavbarToggleButton />
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {menuItems.length > 0 && <NavbarMenuDropdown menuItems={menuItems} />}
          <NavbarSearchForm artCategories={artCategories} />
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li className="login-ul">
            <NavbarAuthAction role={role} />
          </li>
        </ul>
      </div>
    </nav>
  );
};
