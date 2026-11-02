import { Link, Outlet } from 'react-router-dom';

import { useAuth } from '../../contexts/auth';
import { Button } from '../ui/button';
import { ThemeToggle } from './ThemeToggle';

export function AppShell() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--cadence-bg)] text-[var(--cadence-fg)]">
      <header className="sticky top-0 z-20 border-b border-[var(--cadence-border)] bg-[var(--cadence-bg)]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--cadence-fg)] sm:text-2xl"
          >
            <img
              src="/favicon.svg"
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-md"
            />
            <span>Cadence</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="hidden max-w-[10rem] truncate text-sm text-[var(--cadence-fg-muted)] sm:inline">
                  {user?.name}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-[var(--cadence-fg)] hover:bg-[var(--cadence-muted)]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-9 items-center rounded-md bg-[var(--cadence-accent)] px-3 text-sm font-medium text-[var(--cadence-accent-fg)] hover:opacity-90"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
