import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, TrendingUp } from "lucide-react";
import { getTrendingUsers } from "@/lib/db/queries";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/constants";

interface TrendingUsersProps {
  city?: string;
  title?: string;
  limit?: number;
}

export async function TrendingUsers({ city, title = "Trending in Nepal", limit = 10 }: TrendingUsersProps) {
  const stats = await getTrendingUsers(city, limit);

  if (stats.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-[#DC143C]" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-2">
        {stats.map((stat, idx) => (
          <Link
            key={stat.id}
            href={`/user/${stat.user.username}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-[#2A2A2A] bg-[#141414] hover:border-[#DC143C]/30 hover:bg-[#1A1A1A] transition-all"
          >
            <div className="text-[#6B7280] font-bold text-sm w-6 text-center">
              {idx + 1}
            </div>
            <div className="h-9 w-9 rounded-full overflow-hidden shrink-0">
              {stat.user.avatarUrl ? (
                <Image src={stat.user.avatarUrl} alt={stat.user.displayName} width={36} height={36} className="object-cover" />
              ) : (
                <div className="h-full w-full bg-[#DC143C]/20 text-[#DC143C] flex items-center justify-center font-bold text-xs">
                  {getInitials(stat.user.displayName)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-white truncate">{stat.user.displayName}</span>
                {stat.user.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
              </div>
              <div className="text-xs text-[#6B7280]">
                {stat.user.city ?? "Nepal"} · {CATEGORY_LABELS[stat.category]}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-black text-white text-sm">{Math.round(stat.rankScore)}</div>
              <div className="text-xs text-[#6B7280]">pts</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
