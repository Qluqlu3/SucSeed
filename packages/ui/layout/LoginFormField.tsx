import type { FC, InputHTMLAttributes } from 'react';

type LoginFormFieldProps = {
  id: string;
  label: string;
  helperText: string;
  containerClassName?: string;
  labelClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;

export const LoginFormField: FC<LoginFormFieldProps> = ({
  id,
  label,
  helperText,
  containerClassName,
  labelClassName,
  ...inputProps
}) => (
  <>
    <div className={containerClassName}>
      <label htmlFor={id} className={labelClassName ?? 'block mb-1 text-p-text'}>
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
        {...inputProps}
      />
    </div>
    <small className="modal-small">{helperText}</small>
  </>
);
