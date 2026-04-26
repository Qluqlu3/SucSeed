import type { FC } from 'react';
import { getCsrfToken } from '../utils/csrf';

export const AuthenticityTokenInput: FC = () => (
  <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
);
