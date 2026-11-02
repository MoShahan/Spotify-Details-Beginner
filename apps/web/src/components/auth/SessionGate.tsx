import type { ReactNode } from 'react';

import { useAuth } from '../../contexts/auth';
import { Skeleton } from '../ui/skeleton';

/** Skeleton shell while restoring JWT session - no circular spinners. */
export function SessionGate({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--cadence-bg)] px-4 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-full max-w-sm" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return children;
}
