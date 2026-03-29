import { CardSkeleton } from "@/components/shared/LoadingSpinner";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
      </div>
      <CardSkeleton />
    </div>
  );
}
