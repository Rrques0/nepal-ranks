import { Dumbbell, Crosshair, Crown, Zap, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./StatCard";
import type { CategoryStat } from "@prisma/client";

const CATEGORY_CONFIG = {
  FITNESS: {
    label: "Fitness",
    icon: Dumbbell,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
  PUBG: {
    label: "PUBG Mobile",
    icon: Crosshair,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  CHESS: {
    label: "Chess",
    icon: Crown,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  SPEED: {
    label: "Speed & Reaction",
    icon: Zap,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
};

interface CategoryStatsProps {
  stat: CategoryStat;
}

export function CategoryStats({ stat }: CategoryStatsProps) {
  const config = CATEGORY_CONFIG[stat.category];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
      <div className={`flex items-center justify-between p-4 border-b border-[#2A2A2A] ${config.bgColor}`}>
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <span className="font-bold text-white">{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {stat.isVerified && (
            <Badge variant="verified">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </Badge>
          )}
          <div className="text-right">
            <div className="text-lg font-black text-white">{Math.round(stat.rankScore)}</div>
            <div className="text-xs text-[#6B7280]">Score</div>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Ranks */}
        {stat.nationalRank && (
          <StatCard label="National Rank" value={`#${stat.nationalRank}`} highlight />
        )}
        {stat.cityRank && (
          <StatCard label="City Rank" value={`#${stat.cityRank}`} />
        )}
        {stat.provinceRank && (
          <StatCard label="Province Rank" value={`#${stat.provinceRank}`} />
        )}

        {/* Fitness stats */}
        {stat.category === "FITNESS" && (
          <>
            {stat.benchPressMax && <StatCard label="Bench Press" value={`${stat.benchPressMax}kg`} />}
            {stat.squatMax && <StatCard label="Squat" value={`${stat.squatMax}kg`} />}
            {stat.deadliftMax && <StatCard label="Deadlift" value={`${stat.deadliftMax}kg`} />}
            {stat.consistencyStreak && <StatCard label="Streak" value={`${stat.consistencyStreak}d`} sub="days" />}
          </>
        )}

        {/* PUBG stats */}
        {stat.category === "PUBG" && (
          <>
            {stat.kdRatio && <StatCard label="K/D Ratio" value={stat.kdRatio.toFixed(2)} />}
            {stat.rankTier && <StatCard label="Rank Tier" value={stat.rankTier} />}
            {stat.totalWins && <StatCard label="Wins" value={stat.totalWins} />}
            {stat.avgDamage && <StatCard label="Avg Damage" value={Math.round(stat.avgDamage)} />}
          </>
        )}

        {/* Chess stats */}
        {stat.category === "CHESS" && (
          <>
            {stat.chessRating && <StatCard label="Rating" value={stat.chessRating} />}
            {stat.winRate && <StatCard label="Win Rate" value={`${stat.winRate.toFixed(1)}%`} />}
            {stat.totalGames && <StatCard label="Games" value={stat.totalGames} />}
            {stat.chessUsername && <StatCard label="Chess.com" value={stat.chessUsername} />}
          </>
        )}

        {/* Speed stats */}
        {stat.category === "SPEED" && (
          <>
            {stat.reactionTimeMs && <StatCard label="Reaction" value={`${stat.reactionTimeMs}ms`} />}
            {stat.tappingSpeed && <StatCard label="Tapping" value={`${stat.tappingSpeed}/s`} />}
            {stat.sprintTimeSec && <StatCard label="Sprint 100m" value={`${stat.sprintTimeSec}s`} />}
          </>
        )}
      </div>
    </div>
  );
}
