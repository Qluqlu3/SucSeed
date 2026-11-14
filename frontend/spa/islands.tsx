// frontend/spa/islands.tsx
//
// ERB layout 内の特定 DOM 要素に React コンポーネントを island として
// マウントする。application.ts からインポートされる。
// 新しい island は mountIsland('xxx', <Component />) の
// パターンで追加していく。
// Navbar / Footer / LoginModal などの中身は Next と共用の @sucseed/ui にある。

import { Footer, LoginModal, PendingFlash } from '@sucseed/ui';
import { mountIsland } from './mountIsland';
import { mountNavbarIsland } from './mountNavbarIsland';

mountIsland('spa-footer', <Footer />);
mountIsland('spa-login-modal', <LoginModal />);
// Next の画面から遷移してきたときに、そちらで積んだメッセージを出す
mountIsland('spa-flash', <PendingFlash />);

void mountNavbarIsland();
