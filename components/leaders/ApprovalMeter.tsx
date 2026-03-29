import { cn, getApprovalClass } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ApprovalMeterProps {
  score: number;
  totalVotes: number;
  size?: "sm" | "md";
}

export function ApprovalMeter({ score, totalVotes, size = "md" }: ApprovalMeterProps) {
  const rounded = Math.round(score);
  const colorClass = getApprovalClass(score);

  return (
    <div className={cn("space-y-1.5", size === "sm" && "space-y-1")}>
      <div className="flex items-center justify-between">
        <span className={cn("font-black tabular-nums", colorClass, size === "sm" ? "text-lg" : "text-2xl")}>
          {rounded}%
        </span>
        <span className="text-xs text-[#6B7280]">{totalVotes.toLocaleString()} votes</span>
      </div>
      <Progress
        value={rounded}
        indicatorClassName={cn(
          score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"
        )}
        className={size === "sm" ? "h-1.5" : "h-2.5"}
      />
    </div>
  );
}
