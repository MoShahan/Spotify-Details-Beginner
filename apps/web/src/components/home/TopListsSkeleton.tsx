import { Skeleton } from '../ui/skeleton';

export function TopListsSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {[0, 1].map((column) => (
        <div
          key={column}
          className="cadence-panel flex flex-col gap-4 p-4 sm:p-5"
        >
          <Skeleton className="h-8 w-40" />
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 5 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-12 w-full" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
