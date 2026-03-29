import { Suspense } from "react";
import { getPublicFigures } from "@/lib/db/queries";
import { LeaderCard } from "@/components/leaders/LeaderCard";
import { LeaderDisclaimer } from "@/components/leaders/LeaderDisclaimer";
import { Navbar } from "@/components/layout/Navbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES } from "@/lib/constants";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Leader Rankings" };

const OFFICE_LEVELS = [
  { value: "all", label: "All Levels" },
  { value: "LOCAL", label: "Local" },
  { value: "MUNICIPAL", label: "Municipal" },
  { value: "DISTRICT", label: "District" },
  { value: "PROVINCIAL", label: "Provincial" },
  { value: "NATIONAL", label: "National" },
];

export default async function LeadersPage({
  searchParams,
}: {
  searchParams: Promise<{ province?: string; officeLevel?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  const { figures, total, totalPages } = await getPublicFigures({
    province: params.province === "all" ? undefined : params.province,
    officeLevel: params.officeLevel === "all" ? undefined : params.officeLevel,
    page,
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-[#DC143C]" />
          <div>
            <h1 className="text-2xl font-black text-white">Leader Rankings</h1>
            <p className="text-sm text-[#A0A0A0]">Community approval ratings</p>
          </div>
        </div>

        <LeaderDisclaimer />

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <form className="flex flex-wrap gap-2">
            <select
              name="province"
              defaultValue={params.province ?? "all"}
              className="h-9 rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] px-3 text-sm text-white focus:border-[#DC143C] focus:outline-none"
            >
              <option value="all">All Provinces</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              name="officeLevel"
              defaultValue={params.officeLevel ?? "all"}
              className="h-9 rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] px-3 text-sm text-white focus:border-[#DC143C] focus:outline-none"
            >
              {OFFICE_LEVELS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <Button type="submit" size="sm">Filter</Button>
          </form>
        </div>

        <div className="text-sm text-[#6B7280]">
          <span className="text-white font-medium">{total}</span> leaders rated
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        }>
          {figures.length === 0 ? (
            <EmptyState
              title="No leaders yet"
              description="Leaders are added by the Nepal Ranks team. Check back soon!"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {figures.map((figure) => (
                <LeaderCard key={figure.id} figure={figure} />
              ))}
            </div>
          )}
        </Suspense>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}`}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            <span className="flex items-center text-sm text-[#A0A0A0] px-4">{page} / {totalPages}</span>
            {page < totalPages && (
              <Link href={`?page=${page + 1}`}>
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </>
  );
}
