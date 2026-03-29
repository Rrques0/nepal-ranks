import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
  className?: string;
}

export function StatCard({ label, value, sub, highlight, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 border border-[#2A2A2A] bg-[#141414]",
        highlight && "border-[#DC143C]/30 bg-[#DC143C]/5",
        className
      )}
    >
      <div className="text-xs text-[#6B7280] mb-1 font-medium uppercase tracking-wide">
        {label}
      </div>
      <div
        className={cn(
          "text-2xl font-black tabular-nums",
          highlight ? "text-[#DC143C]" : "text-white"
        )}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-[#A0A0A0] mt-0.5">{sub}</div>}
    </div>
  );
}
