import type { InputHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-[var(--cadence-border)] bg-[var(--cadence-surface)] px-3 py-2 text-sm text-[var(--cadence-fg)] placeholder:text-[var(--cadence-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cadence-ring)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
