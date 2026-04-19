import type { FC } from 'react';
import { getCsrfToken } from './session';

export const AuthenticityTokenInput: FC = () => (
  <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
);
