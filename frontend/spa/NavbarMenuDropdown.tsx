import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import type { NavbarMenuItem } from './navbarMenu';

type NavbarMenuDropdownProps = {
  menuItems: NavbarMenuItem[];
};

export const NavbarMenuDropdown: FC<NavbarMenuDropdownProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <li ref={ref} className="nav-item dropdown">
      <button
        type="button"
        className="nav-link dropdown-toggle"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        メニュー
      </button>
      <div className={`dropdown-menu my-dropdown${isOpen ? ' show' : ''}`}>
        {menuItems.map((item) => (
          <a key={item.href} href={item.href} className="dropdown-item">
            {item.label}
          </a>
        ))}
      </div>
    </li>
  );
};
