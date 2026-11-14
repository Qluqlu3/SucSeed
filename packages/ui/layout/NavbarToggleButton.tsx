import { Menu } from 'lucide-react';
import type { FC } from 'react';

type NavbarToggleButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export const NavbarToggleButton: FC<NavbarToggleButtonProps> = ({ isOpen, onClick }) => (
  <button
    className="navbar-toggler rounded px-2 py-1 md:hidden"
    type="button"
    onClick={onClick}
    aria-controls="navbarSupportedContent"
    aria-expanded={isOpen}
    aria-label="Toggle navigation"
  >
    <Menu className="mini-list" size={26} aria-hidden="true" />
  </button>
);
