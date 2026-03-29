import Link from "next/link";
import { Clock, Users, Trophy, Dumbbell, Crosshair, Crown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNPR, cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";
import type { Challenge } from "@prisma/client";

const CATEGORY_ICONS = {
  FITNESS: Dumbbell,
  PUBG: Crosshair,
  CHESS: Crown,
  SPEED: Zap,
};

const CATEGORY_COLORS = {
  FITNESS: "text-orange-400 bg-orange-400/10",
  PUBG: "text-yellow-400 bg-yellow-400/10",
  CHESS: "text-purple-400 bg-purple-400/10",
  SPEED: "text-blue-400 bg-blue-400/10",
};

interface ChallengeCardProps {
  challenge: Challenge & { _count: { entries: number } };
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const daysLeft = differenceInDays(new Date(challenge.endDate), new Date());
  const Icon = CATEGORY_ICONS[challenge.category];
  const colorClass = CATEGORY_COLORS[challenge.category];
  const isUrgent = daysLeft <= 3;

  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 hover:border-[#DC143C]/40 transition-all hover:bg-[#1A1A1A] h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shrink-0", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex flex-col items-end gap-1">
            {challenge.entryFeeNPR > 0 ? (
              <Badge variant="warning">{formatNPR(challenge.entryFeeNPR)}</Badge>
            ) : (
              <Badge variant="success">Free Entry</Badge>
            )}
          </div>
        </div>

        <h3 className="font-bold text-white mb-1 line-clamp-2">{challenge.title}</h3>
        <p className="text-sm text-[#A0A0A0] mb-4 line-clamp-2 flex-1">{challenge.description}</p>

        {challenge.prizeDescription && (
          <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20">
            <Trophy className="h-4 w-4 text-[#FFD700] shrink-0" />
            <p className="text-xs text-[#FFD700] font-medium line-clamp-1">
              {challenge.prizeDescription}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#6B7280] border-t border-[#2A2A2A] pt-3 mt-auto">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{challenge._count.entries} joined</span>
          </div>
          <div className={cn("flex items-center gap-1", isUrgent && "text-red-400 font-medium")}>
            <Clock className="h-3.5 w-3.5" />
            <span>{daysLeft <= 0 ? "Ended" : `${daysLeft}d left`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
