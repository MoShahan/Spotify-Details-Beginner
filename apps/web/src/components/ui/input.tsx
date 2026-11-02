import type { InputHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'cadence-field flex h-10 w-full px-3 py-2 text-sm text-[var(--cadence-fg)] placeholder:text-[var(--cadence-fg-muted)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
