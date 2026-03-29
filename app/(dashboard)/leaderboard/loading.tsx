import { LeaderboardSkeleton } from "@/components/shared/LoadingSpinner";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48 rounded" />
      <div className="skeleton h-10 w-full rounded-lg" />
      <LeaderboardSkeleton />
    </div>
  );
}
