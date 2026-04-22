import type { FC } from 'react';

type NavbarBrandProps = {
  logoSrc: string;
  titleSrc: string;
};

export const NavbarBrand: FC<NavbarBrandProps> = ({ logoSrc, titleSrc }) => (
  <>
    <img src={logoSrc} className='logo' width='50' height='50' alt='ロゴ' />
    <a href='/index' className='navbar-brand my-brand'>
      <img src={titleSrc} width='150' alt='SucSeed' />
    </a>
  </>
);
