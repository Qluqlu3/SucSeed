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
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input id={id} className="form-control" {...inputProps} />
    </div>
    <small className="modal-small">{helperText}</small>
  </>
);
