import { Disc3, Home, Info, LogOut, Menu, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../../contexts/auth';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ThemeToggle } from './ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-2.5 rounded-[var(--cadence-radius)] px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-[var(--cadence-muted)] text-[var(--cadence-fg)] shadow-[var(--cadence-shadow-sm)]'
      : 'text-[var(--cadence-fg-muted)] hover:bg-[var(--cadence-muted)]/70 hover:text-[var(--cadence-fg)]',
  );

function SidebarBrand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="mx-3 mt-4 mb-2 flex items-center gap-2.5 rounded-[var(--cadence-radius)] px-3 py-3 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--cadence-fg)] hover:bg-[var(--cadence-muted)]/70"
    >
      <img
        src="/favicon.svg"
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
      <div className="overflow-hidden rounded-[var(--cadence-radius)] border border-[var(--cadence-border)] bg-[var(--cadence-muted)]/35 shadow-[var(--cadence-shadow-sm)]">
        <div className="flex items-center gap-3 px-3 pt-3 pb-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-[calc(var(--cadence-radius)-1px)] bg-[var(--cadence-accent)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--cadence-accent-fg)] shadow-[var(--cadence-shadow-sm)]"
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
            className="flex w-full items-center gap-2 rounded-[calc(var(--cadence-radius)-2px)] px-2.5 py-2 text-sm font-medium text-[var(--cadence-fg-muted)] transition-colors hover:bg-[var(--cadence-surface)] hover:text-[var(--cadence-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cadence-ring)]"
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            Log out
          </button>
        </div>
      </div>
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
      <div className="flex min-h-screen flex-col bg-[var(--cadence-bg)] text-[var(--cadence-fg)]">
        <header className="sticky top-0 z-20 border-b border-[var(--cadence-border)] bg-[var(--cadence-surface)]/85 shadow-[var(--cadence-shadow-sm)] backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
            <Link
              to="/login"
              className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight"
            >
              <img
                src="/favicon.svg"
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-[calc(var(--cadence-radius)-2px)]"
              />
              <span>Cadence</span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <Link
                to="/about"
                className="inline-flex h-9 items-center rounded-[var(--cadence-radius)] px-3 text-sm font-medium text-[var(--cadence-fg-muted)] hover:bg-[var(--cadence-muted)] hover:text-[var(--cadence-fg)]"
              >
                About
              </Link>
              <Link
                to="/login"
                className="inline-flex h-9 items-center rounded-[var(--cadence-radius)] px-3 text-sm font-medium text-[var(--cadence-fg)] hover:bg-[var(--cadence-muted)]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center rounded-[var(--cadence-radius)] bg-[var(--cadence-accent)] px-3 text-sm font-medium text-[var(--cadence-accent-fg)] shadow-[var(--cadence-shadow-sm)] hover:opacity-90"
              >
                Sign up
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </main>
      </div>
    );
  }

  const displayName = user?.name ?? 'Account';

  return (
    <div className="flex min-h-screen bg-[var(--cadence-bg)] text-[var(--cadence-fg)]">
      {/* Desktop sidebar - brand + nav + account; no top header needed */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-[var(--cadence-border)] bg-[var(--cadence-surface)]/95 shadow-[var(--cadence-shadow-sm)] backdrop-blur-sm md:flex">
        <SidebarBrand />
        <SidebarNav />
        <SidebarAccount name={displayName} onLogout={logout} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <aside className="relative flex h-full w-56 flex-col border-r border-[var(--cadence-border)] bg-[var(--cadence-surface)] shadow-[var(--cadence-shadow)]">
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

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile only: open the sidebar drawer. Desktop has no header. */}
        <header className="sticky top-0 z-20 border-b border-[var(--cadence-border)] bg-[var(--cadence-surface)]/85 shadow-[var(--cadence-shadow-sm)] backdrop-blur-md md:hidden">
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

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
