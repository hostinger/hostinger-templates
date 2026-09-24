import type { ReactNode } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (describedBy: string | undefined) => ReactNode;
};

export function FormField({ id, label, error, hint, optional = false, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {optional && <span className="field__optional">Optional</span>}
      </label>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {children(describedBy)}
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
