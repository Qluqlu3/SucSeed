import { Map as MapIcon } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="my_nav absolute top-0 left-0 z-2 flex w-full flex-wrap items-center justify-between bg-[rgba(104,70,165,0.8)] px-[1%]">
      <div className="flex items-center gap-2">
        <NavbarBrand logoSrc={logoSrc} titleSrc={titleSrc} />
      </div>
      <NavbarToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <div
        className={`w-full flex-col gap-3 rounded-b bg-p-dark p-4 md:static md:flex md:w-auto md:flex-1 md:flex-row md:items-center md:justify-between md:gap-4 md:bg-transparent md:p-0 ${isOpen ? 'absolute top-full left-0 flex' : 'hidden'}`}
        id="navbarSupportedContent"
      >
        <ul className="flex flex-col gap-2 md:flex-row md:items-center">
          {menuItems.length > 0 && <NavbarMenuDropdown menuItems={menuItems} />}
          <li>
            <a
              href="/map"
              className="flex items-center gap-1 px-3 py-1 text-white hover:text-p-gold"
            >
              <MapIcon size={18} />
              地図から探す
            </a>
          </li>
          <NavbarSearchForm artCategories={artCategories} />
        </ul>
        <ul className="flex">
          <li className="login-ul">
            <NavbarAuthAction role={role} />
          </li>
        </ul>
      </div>
    </nav>
  );
};
