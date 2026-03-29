import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { RankBadge } from "./RankBadge";
import { getInitials, cn } from "@/lib/utils";
import type { CategoryStat, User } from "@prisma/client";

type StatWithUser = CategoryStat & {
  user: Pick<User, "username" | "displayName" | "avatarUrl" | "city" | "isVerified" | "isPremium">;
};

interface LeaderboardCardProps {
  stat: StatWithUser;
  rank: number;
}

export function LeaderboardCard({ stat, rank }: LeaderboardCardProps) {
  return (
    <Link href={`/user/${stat.user.username}`}>
      <div className={cn(
        "p-4 rounded-xl border bg-[#141414] border-[#2A2A2A] hover:border-[#DC143C]/40 transition-all",
        rank === 1 && "border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/5 to-[#141414]",
        rank === 2 && "border-[#C0C0C0]/20",
        rank === 3 && "border-[#CD7F32]/20",
      )}>
        <div className="flex items-center justify-between mb-3">
          <RankBadge rank={rank} />
          <div className={cn(
            "text-2xl font-black tabular-nums",
            rank === 1 && "text-[#FFD700]",
            rank === 2 && "text-[#C0C0C0]",
            rank === 3 && "text-[#CD7F32]",
            rank > 3 && "text-white"
          )}>
            {Math.round(stat.rankScore)}
            <span className="text-xs font-normal text-[#6B7280] ml-1">pts</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden shrink-0">
            {stat.user.avatarUrl ? (
              <Image src={stat.user.avatarUrl} alt={stat.user.displayName} width={40} height={40} className="object-cover" />
            ) : (
              <div className="h-full w-full bg-[#DC143C]/20 text-[#DC143C] flex items-center justify-center font-bold text-sm">
                {getInitials(stat.user.displayName)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className={cn("font-semibold text-sm truncate", stat.user.isPremium && "text-[#FFD700]")}>
                {stat.user.displayName}
              </span>
              {stat.user.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
            </div>
            <div className="text-xs text-[#6B7280]">{stat.user.city ?? "Nepal"}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
