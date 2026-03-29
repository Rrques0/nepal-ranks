import { notFound } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, MapPin, Building } from "lucide-react";
import { getPublicFigureById } from "@/lib/db/queries";
import { LeaderDisclaimer } from "@/components/leaders/LeaderDisclaimer";
import { ApprovalMeter } from "@/components/leaders/ApprovalMeter";
import { VoteButton } from "@/components/leaders/VoteButton";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const figure = await getPublicFigureById(id);
  if (!figure) return { title: "Leader not found" };
  return { title: `${figure.name} — Nepal Ranks Leaders` };
}

const OFFICE_LEVEL_LABELS = {
  LOCAL: "Local",
  MUNICIPAL: "Municipal",
  DISTRICT: "District",
  PROVINCIAL: "Provincial",
  NATIONAL: "National",
};

export default async function LeaderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const figure = await getPublicFigureById(id);
  if (!figure) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userVote: number | undefined;
  let isLoggedIn = false;

  if (user) {
    isLoggedIn = true;
    const dbUser = await getUserBySupabaseId(user.id);
    if (dbUser) {
      const vote = await prisma.publicFigureVote.findUnique({
        where: { figureId_userId: { figureId: id, userId: dbUser.id } },
      });
      userVote = vote?.rating;
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-6">
        <Link href="/leaders" className="text-sm text-[#DC143C] hover:underline">
          ← Back to Leaders
        </Link>

        <LeaderDisclaimer />

        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E1E1E] to-[#141414] p-6 border-b border-[#2A2A2A]">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-[#2A2A2A] shrink-0">
                {figure.photoUrl ? (
                  <Image
                    src={figure.photoUrl}
                    alt={figure.name}
                    width={80}
                    height={80}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-black text-[#DC143C]">
                    {figure.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white">{figure.name}</h1>
                  {figure.isVerified && (
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                  )}
                </div>
                <p className="text-[#A0A0A0] mt-1">{figure.office}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <Badge variant="secondary">
                    {OFFICE_LEVEL_LABELS[figure.officeLevel]}
                  </Badge>
                  {figure.party && (
                    <Badge variant="secondary">{figure.party}</Badge>
                  )}
                  {figure.province && (
                    <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <MapPin className="h-3 w-3" />
                      {figure.province}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Approval score */}
          <div className="p-6 border-b border-[#2A2A2A]">
            <h3 className="text-sm font-medium text-[#A0A0A0] mb-3">Community Approval Score</h3>
            <ApprovalMeter score={figure.approvalScore} totalVotes={figure.totalVotes} />
            <p className="text-xs text-[#6B7280] mt-2">
              Based on {figure.totalVotes.toLocaleString()} community votes · last updated {formatDate(figure.updatedAt)}
            </p>
          </div>

          {/* Description */}
          {figure.description && (
            <div className="p-6 border-b border-[#2A2A2A]">
              <h3 className="text-sm font-medium text-[#A0A0A0] mb-2">About</h3>
              <p className="text-sm text-white">{figure.description}</p>
            </div>
          )}

          {/* Voting */}
          <div className="p-6">
            {isLoggedIn ? (
              <VoteButton figureId={id} currentRating={userVote} />
            ) : (
              <div className="rounded-lg bg-[#1E1E1E] p-4 text-center">
                <p className="text-sm text-[#A0A0A0] mb-3">Login to rate this leader</p>
                <Link href="/login">
                  <Button size="sm">Login to Vote</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
