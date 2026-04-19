import type { FC } from 'react';
import { PostForm } from './PostForm';
import type { ArtCategory, Role } from './session';

type NavbarProps = {
  role: Role;
  artCategories: ArtCategory[];
  logoSrc: string;
  titleSrc: string;
};

const CREATOR_MENU = [
  { href: '/my_page/my_page', label: 'マイページ' },
  { href: '/diary/view', label: 'お気に入り日記' },
  { href: '/diary/my_diary', label: 'マイ日記' },
  { href: '/gallery/favorite', label: 'お気に入りギャラリー' },
  { href: '/gallery/my_gallery', label: 'マイギャラリー' },
  { href: '/message/list', label: 'メッセージ' },
  { href: '/match/appealed/list', label: 'アピールリスト' },
  { href: '/match/matching/list', label: 'マッチング一覧' },
  { href: '/match/scout/list_check', label: 'スカウト確認' },
];

const HEIR_MENU = [
  { href: '/my_page/my_page', label: 'マイページ' },
  { href: '/diary/heir/favorite', label: 'お気に入り日記' },
  { href: '/gallery/heir/favorite', label: 'お気に入りギャラリー' },
  { href: '/message/list', label: 'メッセージ' },
  { href: '/match/matching/list', label: 'マッチング一覧' },
  { href: '/match/appeal/list_check', label: 'アピール確認' },
  { href: '/match/scouted/list', label: 'スカウト一覧' },
];

const USER_MENU = [{ href: '/my_page/my_page', label: 'マイページ' }];

export const Navbar: FC<NavbarProps> = ({ role, artCategories, logoSrc, titleSrc }) => {
  const menuItems =
    role === 'creator'
      ? CREATOR_MENU
      : role === 'heir'
        ? HEIR_MENU
        : role === 'user'
          ? USER_MENU
          : null;

  return (
    <nav className="navbar navbar-expand-lg my_nav index-nav">
      <img src={logoSrc} className="logo" width="50" height="50" alt="ロゴ" />
      <a href="/index" className="navbar-brand my-brand">
        <img src={titleSrc} width="150" alt="SucSeed" />
      </a>
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
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {menuItems && (
            <li className="nav-item dropdown">
              <button
                type="button"
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                メニュー
              </button>
              <div className="dropdown-menu">
                {menuItems.map((item) => (
                  <a key={item.href} href={item.href} className="dropdown-item">
                    {item.label}
                  </a>
                ))}
              </div>
            </li>
          )}
          <div className="form-inline">
            <PostForm action="/search/user">
              <select name="search[art_category_id]" className="form-control">
                <option value="">select category ...</option>
                {artCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn search_btn">
                <i className="fas fa-search search_icon" aria-hidden="true" />
              </button>
            </PostForm>
          </div>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li className="login-ul">
            {role === 'guest' ? (
              <button
                type="button"
                className="btn my-login-btn"
                data-toggle="modal"
                data-target="#exampleModalCenter"
              >
                ログイン
              </button>
            ) : (
              <PostForm action="/user/logout">
                <button type="submit" className="btn my-login-btn">
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
