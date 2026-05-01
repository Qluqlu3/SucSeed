import type { FC } from 'react';

export const NavbarToggleButton: FC = () => (
  <button
    className="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarSupportedContent"
    aria-controls="navbarSupportedContent"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span className="navbar-toggler-icon">
      <i className="fas fa-list mini-list" aria-hidden="true" />
    </span>
  </button>
);
