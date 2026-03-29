import { Suspense } from "react";
import { Crown } from "lucide-react";
import { getLeaderboard } from "@/lib/db/queries";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { CategoryFilter } from "@/components/leaderboard/CategoryFilter";
import { RegionFilter } from "@/components/leaderboard/RegionFilter";
import { LeaderboardSkeleton } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Chess Leaderboard" };

export default async function ChessLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ province?: string; city?: string; gender?: string; ageGroup?: string; scope?: string; page?: string; }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  const { stats, total, totalPages } = await getLeaderboard({
    category: "CHESS",
    province: params.province,
    city: params.city,
    gender: params.gender,
    ageGroup: params.ageGroup,
    page,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <Crown className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Chess Rankings</h1>
          <p className="text-sm text-[#A0A0A0]">Nepal&apos;s sharpest minds</p>
        </div>
      </div>
      <CategoryFilter active="chess" />
      <RegionFilter currentFilters={{ province: params.province, city: params.city, gender: params.gender, ageGroup: params.ageGroup, scope: params.scope }} />
      <div className="text-sm text-[#6B7280]"><span className="text-white font-medium">{total}</span> players</div>
      <Suspense fallback={<LeaderboardSkeleton />}>
        {stats.length === 0 ? (
          <EmptyState title="No chess players yet" description="Be the first chess grandmaster ranked in Nepal!" actionLabel="Submit Chess Stats" actionHref="/submit/chess" />
        ) : (
          <LeaderboardTable stats={stats} startRank={(page - 1) * 25 + 1} />
        )}
      </Suspense>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && <Link href={`?page=${page - 1}`}><Button variant="outline" size="sm">Previous</Button></Link>}
          <span className="flex items-center text-sm text-[#A0A0A0] px-4">{page} / {totalPages}</span>
          {page < totalPages && <Link href={`?page=${page + 1}`}><Button variant="outline" size="sm">Next</Button></Link>}
        </div>
      )}
    </div>
  );
}
