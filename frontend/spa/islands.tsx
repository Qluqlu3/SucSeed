// frontend/spa/islands.tsx
//
// ERB layout 内の特定 DOM 要素に React コンポーネントを island として
// マウントする。application.ts からインポートされる。
// 新しい island は mountIsland('xxx', <Component />) の
// パターンで追加していく。

import { Footer } from './Footer';
import { LoginModal } from './LoginModal';
import { mountIsland } from './mountIsland';
import { mountNavbarIsland } from './mountNavbarIsland';

mountIsland('spa-footer', <Footer />);
mountIsland('spa-login-modal', <LoginModal />);

void mountNavbarIsland();
