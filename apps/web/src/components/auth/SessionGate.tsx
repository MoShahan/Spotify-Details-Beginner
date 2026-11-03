import type { ReactNode } from 'react';

import { useAuth } from '../../contexts/auth';
import { Skeleton } from '../ui/skeleton';

/** Skeleton shell while restoring JWT session - no circular spinners. */
export function SessionGate({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen text-[var(--cadence-fg)]">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-[var(--cadence-border)] bg-[var(--cadence-surface)]/90 p-3 md:flex">
          <Skeleton className="mt-4 mb-4 h-12 w-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="mt-auto pb-2">
            <Skeleton className="h-28 w-full" />
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-2 border-b border-[var(--cadence-border)] px-4 md:hidden">
            <Skeleton className="size-9" />
            <Skeleton className="h-5 w-24" />
          </header>
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8 sm:py-10">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="mt-2 grid gap-6 lg:grid-cols-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
