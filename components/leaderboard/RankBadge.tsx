import { cn } from "@/lib/utils";

interface RankBadgeProps {
  rank: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RankBadge({ rank, size = "md", className }: RankBadgeProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-base",
  };

  if (rank === 1) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-black",
          "bg-[#FFD700]/20 text-[#FFD700] ring-2 ring-[#FFD700]/40",
          sizeClasses[size],
          className
        )}
        style={{ textShadow: "0 0 12px rgba(255,215,0,0.6)" }}
      >
        1
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-black",
          "bg-[#C0C0C0]/20 text-[#C0C0C0] ring-2 ring-[#C0C0C0]/30",
          sizeClasses[size],
          className
        )}
      >
        2
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-black",
          "bg-[#CD7F32]/20 text-[#CD7F32] ring-2 ring-[#CD7F32]/30",
          sizeClasses[size],
          className
        )}
      >
        3
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold text-[#A0A0A0]",
        sizeClasses[size],
        className
      )}
    >
      {rank <= 99 ? `#${rank}` : rank}
    </div>
  );
}
