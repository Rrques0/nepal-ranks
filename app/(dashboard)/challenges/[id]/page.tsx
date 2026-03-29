import { notFound } from "next/navigation";
import { Calendar, Trophy, Users, Clock } from "lucide-react";
import { getChallengeById } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";
import { JoinButton } from "@/components/challenges/JoinButton";
import { Badge } from "@/components/ui/badge";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { formatDate, formatNPR } from "@/lib/utils";
import { differenceInDays } from "date-fns";
import { CATEGORY_LABELS } from "@/lib/constants";

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallengeById(id);
  if (!challenge) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dbUser = null;
  let isJoined = false;
  if (user) {
    dbUser = await getUserBySupabaseId(user.id);
    if (dbUser) {
      const entry = await prisma.challengeEntry.findUnique({
        where: { challengeId_userId: { challengeId: id, userId: dbUser.id } },
      });
      isJoined = !!entry;
    }
  }

  const daysLeft = differenceInDays(new Date(challenge.endDate), new Date());

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">{challenge.title}</h1>
            <Badge variant="default">{CATEGORY_LABELS[challenge.category]}</Badge>
          </div>
          <div className="flex flex-col items-end gap-1">
            {challenge.entryFeeNPR > 0 ? (
              <Badge variant="warning">{formatNPR(challenge.entryFeeNPR)}</Badge>
            ) : (
              <Badge variant="success">Free Entry</Badge>
            )}
          </div>
        </div>

        <p className="text-[#A0A0A0] mb-6">{challenge.description}</p>

        {challenge.prizeDescription && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 mb-6">
            <Trophy className="h-5 w-5 text-[#FFD700] shrink-0" />
            <div>
              <p className="text-xs text-[#FFD700]/70 font-medium">Prize</p>
              <p className="text-white font-bold">{challenge.prizeDescription}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 rounded-lg bg-[#1E1E1E]">
            <Users className="h-4 w-4 text-[#DC143C] mx-auto mb-1" />
            <div className="font-bold text-white">{challenge._count.entries}</div>
            <div className="text-xs text-[#6B7280]">Joined</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-[#1E1E1E]">
            <Calendar className="h-4 w-4 text-[#DC143C] mx-auto mb-1" />
            <div className="font-bold text-white text-xs">{formatDate(challenge.startDate)}</div>
            <div className="text-xs text-[#6B7280]">Start</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-[#1E1E1E]">
            <Clock className="h-4 w-4 text-[#DC143C] mx-auto mb-1" />
            <div className={`font-bold text-sm ${daysLeft <= 3 ? "text-red-400" : "text-white"}`}>
              {daysLeft <= 0 ? "Ended" : `${daysLeft}d`}
            </div>
            <div className="text-xs text-[#6B7280]">Remaining</div>
          </div>
        </div>

        <JoinButton
          challengeId={id}
          isJoined={isJoined}
          entryFeeNPR={challenge.entryFeeNPR}
          isLoggedIn={!!dbUser}
        />
      </div>

      {/* Leaderboard */}
      {challenge.entries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Challenge Leaderboard</h2>
          <div className="space-y-2">
            {challenge.entries.map((entry, idx) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#2A2A2A] bg-[#141414]"
              >
                <span className={`font-black w-6 text-sm ${idx === 0 ? "text-[#FFD700]" : "text-[#6B7280]"}`}>
                  #{idx + 1}
                </span>
                <span className="font-medium text-white flex-1">{entry.user.displayName}</span>
                <span className="text-[#A0A0A0] text-sm">{entry.user.city}</span>
                {entry.score && (
                  <span className="font-bold text-white">{entry.score}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
