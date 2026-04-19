import type { FC, FormHTMLAttributes, ReactNode } from 'react';
import { AuthenticityTokenInput } from './AuthenticityTokenInput';

type PostFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'method'> & {
  children: ReactNode;
};

export const PostForm: FC<PostFormProps> = ({ children, ...props }) => (
  <form {...props} method='post'>
    <AuthenticityTokenInput />
    {children}
  </form>
);
