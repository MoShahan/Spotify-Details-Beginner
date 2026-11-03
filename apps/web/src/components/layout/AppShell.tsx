import { Disc3, Home, Info, LogOut, Menu, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/auth';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ThemeToggle } from './ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative flex items-center gap-2.5 rounded-[var(--cadence-radius)] px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-[var(--cadence-muted)]/80 text-[var(--cadence-fg)] before:absolute before:top-1/2 before:left-0 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-[var(--cadence-accent)]'
      : 'text-[var(--cadence-fg-muted)] hover:bg-[var(--cadence-muted)]/60 hover:text-[var(--cadence-fg)]',
  );

function SidebarBrand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="mx-3 mt-4 mb-2 flex items-center gap-2.5 rounded-[var(--cadence-radius)] px-3 py-3 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--cadence-fg)] hover:bg-[var(--cadence-muted)]/60"
    >
      <img
        src="/logo-mark.svg"
        alt=""
        width={28}
        height={28}
        className="size-7 rounded-[calc(var(--cadence-radius)-2px)]"
      />
      <span>Cadence</span>
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Primary">
      <NavLink to="/" end className={navLinkClass} onClick={onNavigate}>
        <Home className="size-4 shrink-0" aria-hidden />
        Home
      </NavLink>
      <NavLink to="/songs" className={navLinkClass} onClick={onNavigate}>
        <Disc3 className="size-4 shrink-0" aria-hidden />
        Songs
      </NavLink>
      <NavLink to="/artists" className={navLinkClass} onClick={onNavigate}>
        <Users className="size-4 shrink-0" aria-hidden />
        Artists
      </NavLink>
      <NavLink to="/about" className={navLinkClass} onClick={onNavigate}>
        <Info className="size-4 shrink-0" aria-hidden />
        About
      </NavLink>
    </nav>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function SidebarAccount({
  name,
  onLogout,
}: {
  name: string;
  onLogout: () => void;
}) {
  return (
    <div className="mt-auto px-3 pt-4 pb-3">
      <div className="overflow-hidden rounded-[var(--cadence-radius)] border border-[var(--cadence-border)] bg-[var(--cadence-surface)]">
        <div className="flex items-center gap-3 px-3 pt-3 pb-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-[calc(var(--cadence-radius)-1px)] bg-[var(--cadence-muted)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--cadence-accent)]"
            aria-hidden
          >
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--cadence-fg)]">
              {name}
            </p>
            <p className="truncate text-xs text-[var(--cadence-fg-muted)]">
              Signed in
            </p>
          </div>
        </div>

        <div className="px-2.5 pb-2.5">
          <ThemeToggle variant="switch" />
        </div>

        <div className="border-t border-[var(--cadence-border)] p-1.5">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-[calc(var(--cadence-radius)-2px)] px-2.5 py-2 text-sm font-medium text-[var(--cadence-fg-muted)] transition-colors hover:bg-[var(--cadence-muted)]/70 hover:text-[var(--cadence-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cadence-ring)]"
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="cadence-page-enter">
      <Outlet />
    </div>
  );
}

export function AppShell() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen flex-col text-[var(--cadence-fg)]">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <img
            src="/images/auth-bg-vinyl.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover object-center opacity-45 dark:opacity-35"
          />
          <img
            src="/images/auth-bg-covers.jpg"
            alt=""
            className="absolute -right-[8%] bottom-[-12%] hidden h-[58%] w-auto max-w-none rotate-3 object-cover opacity-30 blur-[1px] sm:block dark:opacity-25"
          />
          <div className="absolute inset-0 bg-[var(--cadence-bg)]/72 dark:bg-[var(--cadence-bg)]/78" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(900px 480px at 12% -8%, color-mix(in srgb, var(--cadence-accent) 10%, transparent), transparent 55%)',
            }}
          />
        </div>

        <header className="sticky top-0 z-20 border-b border-[var(--cadence-border)] bg-[var(--cadence-surface)]/75 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-8">
            <Link
              to="/login"
              className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight"
            >
              <img
                src="/logo-mark.svg"
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-[calc(var(--cadence-radius)-2px)]"
              />
              <span>Cadence</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <Link
                  to="/about"
                  className="inline-flex h-9 items-center justify-center rounded-[var(--cadence-radius)] px-3 text-sm font-medium text-[var(--cadence-fg-muted)] hover:bg-[var(--cadence-muted)] hover:text-[var(--cadence-fg)]"
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="inline-flex h-9 items-center justify-center rounded-[var(--cadence-radius)] px-3 text-sm font-medium text-[var(--cadence-fg)] hover:bg-[var(--cadence-muted)]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-9 items-center justify-center rounded-[var(--cadence-radius)] bg-[var(--cadence-accent)] px-3 text-sm font-medium text-[var(--cadence-accent-fg)] hover:opacity-90"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
          <AnimatedOutlet />
        </main>
      </div>
    );
  }

  const displayName = user?.name ?? 'Account';

  return (
    <div className="relative flex min-h-screen text-[var(--cadence-fg)]">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <img
          src="/images/auth-bg-covers.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover object-[center_30%] opacity-30 dark:opacity-22"
        />
        <img
          src="/images/auth-bg-vinyl.jpg"
          alt=""
          className="absolute -left-[12%] top-[-18%] hidden h-[70%] w-auto max-w-none -rotate-2 object-cover opacity-20 blur-[1.5px] lg:block dark:opacity-15"
        />
        <div className="absolute inset-0 bg-[var(--cadence-bg)]/82 dark:bg-[var(--cadence-bg)]/86" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(800px 420px at 85% 0%, color-mix(in srgb, var(--cadence-accent) 8%, transparent), transparent 55%)',
          }}
        />
      </div>

      <aside className="sticky top-0 z-20 hidden h-screen w-56 shrink-0 flex-col border-r border-[var(--cadence-border)] bg-[var(--cadence-surface)]/92 backdrop-blur-sm md:flex">
        <SidebarBrand />
        <SidebarNav />
        <SidebarAccount name={displayName} onLogout={logout} />
      </aside>

      {mobileOpen ? (
        <div className="cadence-drawer-backdrop fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <aside className="cadence-drawer-panel relative flex h-full w-56 flex-col border-r border-[var(--cadence-border)] bg-[var(--cadence-surface)] shadow-[var(--cadence-shadow)]">
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                <X className="size-4" aria-hidden />
              </Button>
              <SidebarBrand onNavigate={closeMobile} />
            </div>
            <SidebarNav onNavigate={closeMobile} />
            <SidebarAccount
              name={displayName}
              onLogout={() => {
                closeMobile();
                logout();
              }}
            />
          </aside>
        </div>
      ) : null}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--cadence-border)] bg-[var(--cadence-surface)]/80 backdrop-blur-md md:hidden">
          <div className="flex h-14 items-center gap-2 px-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => {
                setMobileOpen(true);
              }}
            >
              <Menu className="size-4" aria-hidden />
            </Button>
            <span className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight">
              Cadence
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  );
}
