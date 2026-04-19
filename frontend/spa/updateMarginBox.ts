import type { Role } from './session';

export const updateMarginBox = (role: Role): void => {
  const marginBoxEl = document.getElementById('spa-margin-box');
  if (!marginBoxEl) {
    return;
  }

  marginBoxEl.className = role !== 'guest' ? 'none-margin-box' : '';
};
