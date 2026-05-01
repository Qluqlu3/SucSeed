import type { FC, FormHTMLAttributes, ReactNode } from 'react';
import { getCsrfToken } from '../../utils/csrf';

type PostFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'method'> & {
  children: ReactNode;
};

export const PostForm: FC<PostFormProps> = ({ children, ...props }) => (
  <form {...props} method='post'>
    <input type='hidden' name='authenticity_token' value={getCsrfToken()} />
    {children}
  </form>
);
