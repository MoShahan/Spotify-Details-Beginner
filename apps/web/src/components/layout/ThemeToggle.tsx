import { Moon, Sun } from 'lucide-react';

import { useTheme } from '../../contexts/theme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

type ThemeToggleProps = {
  variant?: 'icon' | 'switch';
  className?: string;
};

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'switch') {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 rounded-[var(--cadence-radius)] bg-[var(--cadence-muted)]/55 px-2.5 py-2',
          className,
        )}
      >
        <span className="text-xs font-medium tracking-wide text-[var(--cadence-fg-muted)] uppercase">
          Theme
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative grid h-8 w-16 shrink-0 grid-cols-2 items-center rounded-md border border-[var(--cadence-border)] bg-[var(--cadence-surface)] p-[3px] shadow-[var(--cadence-shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cadence-ring)]"
          onClick={toggleTheme}
        >
          <span
            aria-hidden
            className={cn(
              'absolute top-[3px] bottom-[3px] left-[3px] z-0 w-[calc((100%-6px)/2)] rounded-[calc(var(--cadence-radius)-2px)] bg-[var(--cadence-accent)] shadow-[var(--cadence-shadow-sm)] transition-transform duration-200 ease-out',
              isDark ? 'translate-x-full' : 'translate-x-0',
            )}
          />
          <span
            className={cn(
              'relative z-10 flex items-center justify-center transition-colors',
              isDark
                ? 'text-[var(--cadence-fg-muted)]'
                : 'text-[var(--cadence-accent-fg)]',
            )}
          >
            <Sun className="size-3.5" aria-hidden />
          </span>
          <span
            className={cn(
              'relative z-10 flex items-center justify-center transition-colors',
              isDark
                ? 'text-[var(--cadence-accent-fg)]'
                : 'text-[var(--cadence-fg-muted)]',
            )}
          >
            <Moon className="size-3.5" aria-hidden />
          </span>
        </button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={cn('size-9 shrink-0 px-0', className)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </Button>
  );
}
