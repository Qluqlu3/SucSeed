import type { FC } from 'react';

type Flash = Record<string, string>;

interface Props {
  flash: Flash;
}

export const FlashMessages: FC<Props> = ({ flash }) => {
  const entries = Object.entries(flash);
  if (entries.length === 0) return null;

  return (
    <div className="alert-box">
      {entries.map(([key, message]) => (
        <div key={key} className={`alert alert-${key}`}>
          {message}
        </div>
      ))}
    </div>
  );
};
