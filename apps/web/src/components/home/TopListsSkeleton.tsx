import { Skeleton } from '../ui/skeleton';

export function TopListsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {[0, 1].map((column) => (
        <div key={column} className="flex flex-col gap-3">
          <Skeleton className="h-6 w-36" />
          <div className="cadence-panel flex flex-col gap-3 px-3 py-3 sm:px-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-4 w-5" />
                <Skeleton className="size-12 shrink-0 rounded-[calc(var(--cadence-radius)-2px)]" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
