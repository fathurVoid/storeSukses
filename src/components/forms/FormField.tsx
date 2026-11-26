import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  hint?: string;
}

export function FormField({ label, htmlFor, children, error, hint }: FormFieldProps) {
  return (
    <div className={`form-field${error ? ' has-error' : ''}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? (
        <small className="form-error" role="alert">
          {error}
        </small>
      ) : (
        hint && <small className="form-hint">{hint}</small>
      )}
    </div>
  );
}
