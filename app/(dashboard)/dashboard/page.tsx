import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, TrendingUp, Zap, ArrowRight, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/profile/StatCard";
import { CategoryStats } from "@/components/profile/CategoryStats";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await getUserBySupabaseId(user.id);
  if (!dbUser) redirect("/login");

  const [userStats, activeChallenges, recentActivity] = await Promise.all([
    prisma.categoryStat.findMany({
      where: { userId: dbUser.id },
      orderBy: { rankScore: "desc" },
    }),
    prisma.challenge.findMany({
      where: { status: "ACTIVE" },
      orderBy: { endDate: "asc" },
      take: 3,
      include: { _count: { select: { entries: true } } },
    }),
    prisma.statEntry.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const topStat = userStats[0];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#DC143C]/20 to-[#1E1E1E] border border-[#DC143C]/20 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[#A0A0A0] text-sm mb-1">Welcome back 👋</p>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {dbUser.displayName}
            </h1>
            {topStat && (
              <div className="flex items-center gap-2 mt-2">
                <Trophy className="h-4 w-4 text-[#FFD700]" />
                <span className="text-sm text-[#A0A0A0]">
                  <span className="text-white font-bold">#{topStat.nationalRank ?? "—"}</span> in Nepal ·{" "}
                  <span className="text-white font-bold">#{topStat.cityRank ?? "—"}</span> in {dbUser.city ?? "your city"}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link href="/submit/fitness">
              <Button size="sm">
                <Send className="h-4 w-4" />
                Submit Stats
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick rank overview */}
      {userStats.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {userStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={CATEGORY_LABELS[stat.category]}
              value={`#${stat.nationalRank ?? "—"}`}
              sub={`${Math.round(stat.rankScore)} pts`}
              highlight={stat === topStat}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Trophy className="h-12 w-12 text-[#DC143C]/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">No rankings yet</h3>
            <p className="text-sm text-[#A0A0A0] mb-4">Submit your first stats to get ranked!</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["fitness", "pubg", "chess", "speed"].map((cat) => (
                <Link key={cat} href={`/submit/${cat}`}>
                  <Button variant="outline" size="sm" className="capitalize">{cat}</Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats detail */}
      {userStats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Your Stats</h2>
          <div className="space-y-4">
            {userStats.map((stat) => (
              <CategoryStats key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      )}

      {/* Active challenges */}
      {activeChallenges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Active Challenges</h2>
            <Link href="/challenges" className="text-sm text-[#DC143C] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] divide-y divide-[#2A2A2A]">
            {recentActivity.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm font-medium text-white">
                    {CATEGORY_LABELS[entry.category]} stats submitted
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {formatRelativeTime(entry.createdAt)}
                  </div>
                </div>
                <Badge
                  variant={
                    entry.status === "APPROVED"
                      ? "success"
                      : entry.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {entry.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
