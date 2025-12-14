import { forwardRef } from 'react';
import clsx from 'clsx';

const Skeleton = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('animate-pulse rounded-md bg-gray-200', className)}
    {...props}
  />
));
Skeleton.displayName = 'Skeleton';

export { Skeleton };

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16 rounded-lg" />
        <Skeleton className="h-4 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
