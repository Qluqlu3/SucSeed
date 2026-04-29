import { mountIsland } from './mountIsland';
import { Navbar } from './Navbar';
import { fetchSessionPayload } from './session';
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
