import { cn } from '../../lib/utils';

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--cadence-radius)] bg-[var(--cadence-muted)]',
        className,
      )}
      aria-hidden
    />
  );
}
