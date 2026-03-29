import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, Minus, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApprovalMeter } from "./ApprovalMeter";
import type { PublicFigure } from "@prisma/client";

const OFFICE_LEVEL_LABELS = {
  LOCAL: "Local",
  MUNICIPAL: "Municipal",
  DISTRICT: "District",
  PROVINCIAL: "Provincial",
  NATIONAL: "National",
};

interface LeaderCardProps {
  figure: PublicFigure;
}

export function LeaderCard({ figure }: LeaderCardProps) {
  const TrendIcon =
    figure.trendDirection === "UP"
      ? TrendingUp
      : figure.trendDirection === "DOWN"
        ? TrendingDown
        : Minus;

  const trendClass =
    figure.trendDirection === "UP"
      ? "text-green-500"
      : figure.trendDirection === "DOWN"
        ? "text-red-500"
        : "text-[#6B7280]";

  return (
    <Link href={`/leaders/${figure.id}`} className="block group">
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 hover:border-[#DC143C]/40 transition-all duration-200 group-hover:bg-[#1A1A1A]">
        {figure.isPromoted && (
          <div className="mb-2 flex justify-end">
            <Badge variant="gold">Featured</Badge>
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-[#1E1E1E] border border-[#2A2A2A]">
            {figure.photoUrl ? (
              <Image
                src={figure.photoUrl}
                alt={figure.name}
                width={56}
                height={56}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-black text-[#DC143C]">
                {figure.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-white text-sm group-hover:text-[#DC143C] transition-colors truncate">
                {figure.name}
              </span>
              {figure.isVerified && (
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#A0A0A0] truncate">{figure.office}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {OFFICE_LEVEL_LABELS[figure.officeLevel]}
              </Badge>
              {figure.province && (
                <span className="text-xs text-[#6B7280]">{figure.province}</span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <TrendIcon className={`h-5 w-5 ${trendClass}`} />
          </div>
        </div>

        <ApprovalMeter
          score={figure.approvalScore}
          totalVotes={figure.totalVotes}
          size="sm"
        />
      </div>
    </Link>
  );
}
