import { Suspense } from "react";
import { Swords } from "lucide-react";
import { getActiveChallenges } from "@/lib/db/queries";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSpinner";

export const metadata = { title: "Challenges" };

export default async function ChallengesPage() {
  const challenges = await getActiveChallenges();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Swords className="h-6 w-6 text-[#DC143C]" />
        <div>
          <h1 className="text-2xl font-black text-white">Active Challenges</h1>
          <p className="text-sm text-[#A0A0A0]">Compete, win prizes, climb the ranks</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      }>
        {challenges.length === 0 ? (
          <EmptyState
            title="No active challenges"
            description="Check back soon — new challenges are added weekly!"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}
