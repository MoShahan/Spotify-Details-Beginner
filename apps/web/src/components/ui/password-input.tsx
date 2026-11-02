import { Eye, EyeOff } from 'lucide-react';
import { type ComponentPropsWithRef, useState } from 'react';

import { cn } from '../../lib/utils';

export type PasswordInputProps = Omit<ComponentPropsWithRef<'input'>, 'type'>;

export function PasswordInput({
  className,
  id,
  disabled,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full rounded-md border border-[var(--cadence-border)] bg-[var(--cadence-surface)] py-2 pr-10 pl-3 text-sm text-[var(--cadence-fg)] placeholder:text-[var(--cadence-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cadence-ring)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        className="absolute top-1/2 right-1 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--cadence-fg-muted)] hover:bg-[var(--cadence-muted)] hover:text-[var(--cadence-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cadence-ring)] disabled:pointer-events-none disabled:opacity-50"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        onClick={() => {
          setVisible((prev) => !prev);
        }}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
