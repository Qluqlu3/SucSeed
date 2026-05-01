import type { FC } from 'react';
import { LoginModalBody } from './LoginModalBody';
import { LoginModalFooter } from './LoginModalFooter';
import { LoginModalHeader } from './LoginModalHeader';

export const LoginModal: FC = () => (
  <div
    className="modal fade"
    id="exampleModalCenter"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
    style={{ zIndex: 1500 }}
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content my-modal">
        <LoginModalHeader />
        <LoginModalBody />
        <LoginModalFooter />
      </div>
    </div>
  </div>
);
