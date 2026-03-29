import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { getUserByUsername } from "@/lib/db/queries";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { CategoryStats } from "@/components/profile/CategoryStats";
import { RankCard } from "@/components/profile/RankCard";
import { prisma } from "@/lib/db/client";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) return { title: "User not found" };
  return {
    title: `${user.displayName} — Nepal Ranks`,
    description: `${user.displayName}'s competitive profile on Nepal Ranks. ${user.city ? `Based in ${user.city}.` : ""}`,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profileUser = await getUserByUsername(username);
  if (!profileUser) notFound();

  const fullUser = await prisma.user.findUnique({
    where: { id: profileUser.id },
    include: {
      stats: { orderBy: { rankScore: "desc" } },
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!fullUser) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isOwnProfile = false;
  let isFollowing = false;

  if (user) {
    const dbUser = await getUserBySupabaseId(user.id);
    if (dbUser) {
      isOwnProfile = dbUser.id === fullUser.id;
      if (!isOwnProfile) {
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: dbUser.id,
              followingId: fullUser.id,
            },
          },
        });
        isFollowing = !!follow;
      }
    }
  }

  const topStat = fullUser.stats[0];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6">
        <ProfileHeader
          user={fullUser}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
        />

        {topStat && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">Rank Card</h2>
            <div className="overflow-x-auto pb-2">
              <RankCard user={fullUser} topStat={topStat} />
            </div>
          </div>
        )}

        {fullUser.stats.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Stats & Rankings</h2>
            {fullUser.stats.map((stat) => (
              <CategoryStats key={stat.id} stat={stat} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-8 text-center">
            <p className="text-[#A0A0A0]">No stats submitted yet.</p>
          </div>
        )}
      </main>
    </>
  );
}
