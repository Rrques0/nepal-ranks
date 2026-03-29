import { Suspense } from "react";
import { Trophy, Search } from "lucide-react";
import { getLeaderboard } from "@/lib/db/queries";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { CategoryFilter } from "@/components/leaderboard/CategoryFilter";
import { RegionFilter } from "@/components/leaderboard/RegionFilter";
import { LeaderboardSkeleton } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SearchParams {
  province?: string;
  city?: string;
  gender?: string;
  ageGroup?: string;
  scope?: string;
  search?: string;
  page?: string;
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  // Show all categories combined — just FITNESS as default for "all"
  const { stats, total, totalPages } = await getLeaderboard({
    category: "FITNESS",
    province: params.province,
    city: params.city,
    gender: params.gender,
    ageGroup: params.ageGroup,
    search: params.search,
    page,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Leaderboard</h1>
        <p className="text-[#A0A0A0] text-sm">Nepal&apos;s best competitors, ranked</p>
      </div>

      {/* Category filter */}
      <CategoryFilter active="all" />

      {/* Region filter */}
      <RegionFilter
        currentFilters={{
          province: params.province,
          city: params.city,
          gender: params.gender,
          ageGroup: params.ageGroup,
          scope: params.scope,
        }}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7280]">
          Showing <span className="text-white font-medium">{total}</span> competitors
        </p>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        {stats.length === 0 ? (
          <EmptyState
            title="No competitors yet"
            description="Be the first to submit stats in this category!"
            actionLabel="Submit Stats"
            actionHref="/submit/fitness"
          />
        ) : (
          <LeaderboardTable stats={stats} startRank={(page - 1) * 25 + 1} />
        )}
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link href={`?page=${page - 1}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </Link>
          )}
          <span className="flex items-center text-sm text-[#A0A0A0] px-4">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`?page=${page + 1}`}>
              <Button variant="outline" size="sm">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
