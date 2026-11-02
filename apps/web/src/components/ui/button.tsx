import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--cadence-radius)] text-sm font-medium transition-[opacity,background-color,box-shadow,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cadence-ring)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--cadence-accent)] text-[var(--cadence-accent-fg)] shadow-[var(--cadence-shadow-sm)] hover:opacity-90',
        secondary:
          'border border-[var(--cadence-border)] bg-[var(--cadence-surface)] text-[var(--cadence-fg)] shadow-[var(--cadence-shadow-sm)] hover:bg-[var(--cadence-muted)]',
        ghost: 'text-[var(--cadence-fg)] hover:bg-[var(--cadence-muted)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
