import { GridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 h-20 w-1/2 animate-pulse rounded-xl bg-arena" />
      <GridSkeleton />
    </div>
  );
}
