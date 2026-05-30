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
    <li ref={ref} className='relative'>
      <button
        type='button'
        className='block py-1 px-3 cursor-pointer'
        aria-haspopup='true'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        メニュー
      </button>
      <div
        className={`absolute right-0 z-10 mt-1 w-48 rounded bg-white shadow-lg border border-gray-200 my-dropdown${isOpen ? ' block' : ' hidden'}`}
      >
        {menuItems.map((item) => (
          <a key={item.href} href={item.href} className='block px-4 py-2 text-sm hover:bg-gray-100'>
            {item.label}
          </a>
        ))}
      </div>
    </li>
  );
};
