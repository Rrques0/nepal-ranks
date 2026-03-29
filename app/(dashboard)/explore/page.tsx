import { Compass, TrendingUp, Users } from "lucide-react";
import { TrendingUsers } from "@/components/explore/TrendingUsers";
import { TopByCity } from "@/components/explore/TopByCity";
import { prisma } from "@/lib/db/client";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";

export const metadata = { title: "Explore" };

export default async function ExplorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userCity: string | undefined;
  if (user) {
    const dbUser = await getUserBySupabaseId(user.id);
    userCity = dbUser?.city ?? undefined;
  }

  // "Rising this week" — users who submitted in the last 7 days
  const risingStats = await prisma.categoryStat.findMany({
    where: {
      lastUpdated: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      user: { isBanned: false },
    },
    orderBy: { rankScore: "desc" },
    take: 8,
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true, city: true, province: true, isVerified: true, isPremium: true } },
    },
  });

  // Top female athletes
  const topFemale = await prisma.categoryStat.findMany({
    where: { user: { gender: "FEMALE", isBanned: false } },
    orderBy: { rankScore: "desc" },
    take: 6,
    distinct: ["userId"],
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarUrl: true, city: true, province: true, isVerified: true, isPremium: true } },
    },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <Compass className="h-6 w-6 text-[#DC143C]" />
        <div>
          <h1 className="text-2xl font-black text-white">Explore</h1>
          <p className="text-sm text-[#A0A0A0]">Discover Nepal&apos;s top competitors</p>
        </div>
      </div>

      {/* Trending in Nepal */}
      <TrendingUsers title="Trending in Nepal" limit={10} />

      {/* Your city */}
      {userCity && risingStats.length > 0 && (
        <TrendingUsers city={userCity} title={`Top in ${userCity}`} limit={6} />
      )}

      {/* Rising this week */}
      {risingStats.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-bold text-white">Rising This Week</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {risingStats.map((stat, idx) => (
              <a
                key={stat.id}
                href={`/user/${stat.user.username}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#2A2A2A] bg-[#141414] hover:border-[#DC143C]/30 transition-all"
              >
                <div className="h-9 w-9 rounded-full overflow-hidden bg-[#DC143C]/20 text-[#DC143C] flex items-center justify-center font-bold text-sm shrink-0">
                  {stat.user.displayName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-white truncate">{stat.user.displayName}</div>
                  <div className="text-xs text-[#6B7280]">{stat.user.city ?? "Nepal"} · {stat.category}</div>
                </div>
                <div className="text-sm font-black text-green-400">↑ {Math.round(stat.rankScore)}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Top Female Athletes */}
      {topFemale.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-pink-400" />
            <h3 className="text-lg font-bold text-white">Top Female Athletes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topFemale.map((stat, idx) => (
              <a
                key={stat.id}
                href={`/user/${stat.user.username}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#2A2A2A] bg-[#141414] hover:border-pink-500/30 transition-all"
              >
                <span className="text-sm font-bold text-[#6B7280] w-5">#{idx + 1}</span>
                <div className="h-9 w-9 rounded-full overflow-hidden bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {stat.user.displayName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-white truncate">{stat.user.displayName}</div>
                  <div className="text-xs text-[#6B7280]">{stat.user.city ?? "Nepal"}</div>
                </div>
                <div className="text-sm font-black text-white">{Math.round(stat.rankScore)}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Top By City */}
      <TopByCity />
    </div>
  );
}
