import type { FC } from 'react';
import { getNavbarMenuItems } from './navbarMenu';
import { PostForm } from './PostForm';
import type { ArtCategory, Role } from './session';

type NavbarProps = {
  role: Role;
  artCategories: ArtCategory[];
  logoSrc: string;
  titleSrc: string;
};

export const Navbar: FC<NavbarProps> = ({ role, artCategories, logoSrc, titleSrc }) => {
  const menuItems = getNavbarMenuItems(role);

  return (
    <nav className='navbar navbar-expand-lg my_nav index-nav'>
      <img src={logoSrc} className='logo' width='50' height='50' alt='ロゴ' />
      <a href='/index' className='navbar-brand my-brand'>
        <img src={titleSrc} width='150' alt='SucSeed' />
      </a>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'>
          <i className='fas fa-list mini-list' aria-hidden='true' />
        </span>
      </button>
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav mr-auto'>
          {menuItems && (
            <li className='nav-item dropdown'>
              <button
                type='button'
                className='nav-link dropdown-toggle'
                id='navbarDropdown'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                メニュー
              </button>
              <div className='dropdown-menu'>
                {menuItems.map((item) => (
                  <a key={item.href} href={item.href} className='dropdown-item'>
                    {item.label}
                  </a>
                ))}
              </div>
            </li>
          )}
          <div className='form-inline'>
            <PostForm action='/search/user'>
              <select name='search[art_category_id]' className='form-control'>
                <option value=''>select category ...</option>
                {artCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button type='submit' className='btn search_btn'>
                <i className='fas fa-search search_icon' aria-hidden='true' />
              </button>
            </PostForm>
          </div>
        </ul>
        <ul className='nav navbar-nav navbar-right'>
          <li className='login-ul'>
            {role === 'guest' ? (
              <button
                type='button'
                className='btn my-login-btn'
                data-toggle='modal'
                data-target='#exampleModalCenter'
              >
                ログイン
              </button>
            ) : (
              <PostForm action='/user/logout'>
                <button type='submit' className='btn my-login-btn'>
                  ログアウト
                </button>
              </PostForm>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
