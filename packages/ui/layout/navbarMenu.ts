import type { Role } from './sessionTypes';

export type NavbarMenuItem = {
  href: string;
  label: string;
};

const CREATOR_MENU: NavbarMenuItem[] = [
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

const HEIR_MENU: NavbarMenuItem[] = [
  { href: '/my_page/my_page', label: 'マイページ' },
  { href: '/diary/heir/favorite', label: 'お気に入り日記' },
  { href: '/gallery/heir/favorite', label: 'お気に入りギャラリー' },
  { href: '/message/list', label: 'メッセージ' },
  { href: '/match/matching/list', label: 'マッチング一覧' },
  { href: '/match/appeal/list_check', label: 'アピール確認' },
  { href: '/match/scouted/list', label: 'スカウト一覧' },
];

const USER_MENU: NavbarMenuItem[] = [{ href: '/my_page/my_page', label: 'マイページ' }];

export const getNavbarMenuItems = (role: Role): NavbarMenuItem[] => {
  switch (role) {
    case 'creator':
      return CREATOR_MENU;
    case 'heir':
      return HEIR_MENU;
    case 'user':
      return USER_MENU;
    default:
      return [];
  }
};
