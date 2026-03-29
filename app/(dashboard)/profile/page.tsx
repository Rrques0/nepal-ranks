import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { CategoryStats } from "@/components/profile/CategoryStats";
import { RankCard } from "@/components/profile/RankCard";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await getUserBySupabaseId(user.id);
  if (!dbUser) redirect("/login");

  const fullUser = await prisma.user.findUnique({
    where: { id: dbUser.id },
    include: {
      stats: { orderBy: { rankScore: "desc" } },
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!fullUser) redirect("/login");

  const topStat = fullUser.stats[0];

  return (
    <div className="space-y-6">
      <ProfileHeader user={fullUser} isOwnProfile />

      {/* Shareable rank card */}
      {topStat && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Your Rank Card</h2>
          <div className="overflow-x-auto pb-2">
            <RankCard user={fullUser} topStat={topStat} />
          </div>
        </div>
      )}

      {/* Category stats */}
      {fullUser.stats.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Stats & Rankings</h2>
          {fullUser.stats.map((stat) => (
            <CategoryStats key={stat.id} stat={stat} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-8 text-center">
          <p className="text-[#A0A0A0] mb-4">No stats submitted yet. Submit your first stats to get ranked!</p>
          <a href="/submit/fitness" className="inline-flex">
            <div className="bg-[#DC143C] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#B01030] transition-colors">
              Submit Stats
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
