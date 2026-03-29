import { Trophy, MapPin } from "lucide-react";
import type { User, CategoryStat } from "@prisma/client";

interface RankCardProps {
  user: Pick<User, "displayName" | "username" | "city" | "province" | "isPremium" | "isVerified">;
  topStat?: CategoryStat;
}

export function RankCard({ user, topStat }: RankCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 text-white"
      style={{
        background: "linear-gradient(135deg, #DC143C 0%, #8B0000 50%, #0A0A0A 100%)",
        border: "1px solid rgba(220,20,60,0.3)",
        minWidth: 320,
        maxWidth: 400,
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 translate-y-8 -translate-x-8" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#FFD700]" />
          <span className="font-black text-sm tracking-widest text-white/80">NEPAL RANKS</span>
        </div>
        {topStat && (
          <div className="text-right">
            <div className="text-xs text-white/60">National</div>
            <div className="font-black text-[#FFD700]">#{topStat.nationalRank ?? "—"}</div>
          </div>
        )}
      </div>

      {/* Name */}
      <div className="relative mb-4">
        <div className="text-3xl font-black leading-tight">{user.displayName}</div>
        <div className="text-white/60 text-sm">@{user.username}</div>
      </div>

      {/* Location */}
      {(user.city || user.province) && (
        <div className="flex items-center gap-1 text-white/70 text-sm mb-4">
          <MapPin className="h-3.5 w-3.5" />
          {[user.city, user.province].filter(Boolean).join(", ")}
        </div>
      )}

      {/* Score */}
      {topStat && (
        <div className="flex items-end justify-between relative">
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wide mb-1">{topStat.category}</div>
            <div className="text-4xl font-black text-[#FFD700]">
              {Math.round(topStat.rankScore)}
            </div>
            <div className="text-xs text-white/60">rank score</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/60">City Rank</div>
            <div className="text-2xl font-black">#{topStat.cityRank ?? "—"}</div>
          </div>
        </div>
      )}

      {/* Nepal flag red stripe at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#DC143C] to-[#FFD700]" />
    </div>
  );
}
