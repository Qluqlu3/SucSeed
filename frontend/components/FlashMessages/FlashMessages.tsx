import type { FC } from 'react';

type Flash = Record<string, string>;

interface Props {
  flash: Flash;
}

const FLASH_STYLES: Record<string, string> = {
  success: 'bg-green-100 border border-green-400 text-green-800',
  danger: 'bg-red-100 border border-red-400 text-red-800',
  information: 'bg-blue-100 border border-blue-400 text-blue-800',
};

const DEFAULT_STYLE = 'bg-gray-100 border border-gray-400 text-gray-800';

export const FlashMessages: FC<Props> = ({ flash }) => {
  const entries = Object.entries(flash);
  if (entries.length === 0) return null;

  return (
    <div className="mx-0 my-0 opacity-90 z-10">
      {entries.map(([key, message]) => (
        <div key={key} className={`px-4 py-3 rounded mb-2 ${FLASH_STYLES[key] ?? DEFAULT_STYLE}`}>
          {message}
        </div>
      ))}
    </div>
  );
};
