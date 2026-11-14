import { fetchSessionPayload, Navbar } from '@sucseed/ui';
import { mountIsland } from './mountIsland';
import { updateMarginBox } from './updateMarginBox';

export const mountNavbarIsland = async (): Promise<void> => {
  try {
    const { role, artCategories, layoutAssets } = await fetchSessionPayload();
    mountIsland(
      'spa-navbar',
      <Navbar
        role={role}
        artCategories={artCategories}
        logoSrc={layoutAssets.logoSrc}
        titleSrc={layoutAssets.titleSrc}
      />,
    );
    updateMarginBox(role);
  } catch {
    updateMarginBox('guest');
  }
};
