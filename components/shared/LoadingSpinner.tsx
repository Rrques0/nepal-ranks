import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-[#2A2A2A] border-t-[#DC143C]",
        sizeClasses[size],
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-[#141414] border border-[#2A2A2A]"
        >
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
          <div className="skeleton h-6 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
    </div>
  );
}
