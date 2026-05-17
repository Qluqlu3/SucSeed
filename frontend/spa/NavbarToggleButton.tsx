import type { FC } from 'react';

type NavbarToggleButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export const NavbarToggleButton: FC<NavbarToggleButtonProps> = ({ isOpen, onClick }) => (
  <button
    className='navbar-toggler'
    type='button'
    onClick={onClick}
    aria-controls='navbarSupportedContent'
    aria-expanded={isOpen}
    aria-label='Toggle navigation'
  >
    <span className='navbar-toggler-icon'>
      <i className='fas fa-list mini-list' aria-hidden='true' />
    </span>
  </button>
);
