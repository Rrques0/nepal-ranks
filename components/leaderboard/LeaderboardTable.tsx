import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { RankBadge } from "./RankBadge";
import { Badge } from "@/components/ui/badge";
import { getInitials, cn } from "@/lib/utils";
import type { CategoryStat, User } from "@prisma/client";

type StatWithUser = CategoryStat & {
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl" | "city" | "province" | "isVerified" | "isPremium">;
};

interface LeaderboardTableProps {
  stats: StatWithUser[];
  startRank?: number;
}

function TrendIcon({ score }: { score: number }) {
  if (score > 700) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (score < 300) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-[#6B7280]" />;
}

export function LeaderboardTable({ stats, startRank = 1 }: LeaderboardTableProps) {
  return (
    <div className="space-y-2">
      {stats.map((stat, idx) => {
        const rank = startRank + idx;
        const isTop3 = rank <= 3;

        return (
          <Link
            key={stat.id}
            href={`/user/${stat.user.username}`}
            className={cn(
              "flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all duration-200 cursor-pointer group",
              isTop3
                ? "border-[#2A2A2A] bg-gradient-to-r from-[#141414] to-[#1A1A1A] hover:border-[#DC143C]/40"
                : "border-[#2A2A2A] bg-[#141414] hover:border-[#DC143C]/30 hover:bg-[#1A1A1A]"
            )}
          >
            {/* Rank Badge */}
            <RankBadge rank={rank} size={isTop3 ? "md" : "sm"} className="shrink-0" />

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={cn(
                "h-9 w-9 md:h-10 md:w-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm",
                isTop3 ? "ring-2" : "",
                rank === 1 && "ring-[#FFD700]/40",
                rank === 2 && "ring-[#C0C0C0]/40",
                rank === 3 && "ring-[#CD7F32]/40",
              )}>
                {stat.user.avatarUrl ? (
                  <Image
                    src={stat.user.avatarUrl}
                    alt={stat.user.displayName}
                    width={40}
                    height={40}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full bg-[#DC143C]/20 text-[#DC143C] flex items-center justify-center">
                    {getInitials(stat.user.displayName)}
                  </div>
                )}
              </div>
            </div>

            {/* Name + Location */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "font-semibold text-sm md:text-base truncate",
                  stat.user.isPremium ? "text-[#FFD700]" : "text-white",
                  "group-hover:text-[#DC143C] transition-colors"
                )}>
                  {stat.user.displayName}
                </span>
                {stat.user.isVerified && (
                  <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                )}
                {stat.isVerified && (
                  <Badge variant="verified" className="text-xs hidden md:inline-flex">Verified</Badge>
                )}
              </div>
              <div className="text-xs text-[#6B7280] truncate">
                @{stat.user.username}
                {stat.user.city && ` · ${stat.user.city}`}
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 shrink-0">
              <TrendIcon score={stat.rankScore} />
              <div className="text-right">
                <div className={cn(
                  "font-black text-base md:text-lg tabular-nums",
                  rank === 1 && "text-[#FFD700]",
                  rank === 2 && "text-[#C0C0C0]",
                  rank === 3 && "text-[#CD7F32]",
                  rank > 3 && "text-white"
                )}>
                  {Math.round(stat.rankScore)}
                </div>
                <div className="text-xs text-[#6B7280]">pts</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
