import { getPendingSubmissions } from "@/lib/db/queries";
import { reviewSubmissionAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";

export const metadata = { title: "Review Submissions" };

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const { entries, total } = await getPendingSubmissions(page);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileCheck className="h-6 w-6 text-yellow-400" />
        <div>
          <h1 className="text-2xl font-black text-white">Review Submissions</h1>
          <p className="text-[#A0A0A0] text-sm">{total} pending submissions</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState title="All caught up!" description="No pending submissions to review." />
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            let parsedValue: Record<string, unknown> = {};
            try { parsedValue = JSON.parse(entry.value); } catch {}

            return (
              <Card key={entry.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{entry.user.displayName}</span>
                        <span className="text-[#6B7280] text-sm">@{entry.user.username}</span>
                        <Badge variant="default">{entry.category}</Badge>
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {entry.user.email} · {formatRelativeTime(entry.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={async () => {
                        "use server";
                        await reviewSubmissionAction({ entryId: entry.id, status: "APPROVED" });
                      }}>
                        <Button type="submit" size="sm" variant="default">Approve</Button>
                      </form>
                      <form action={async () => {
                        "use server";
                        await reviewSubmissionAction({ entryId: entry.id, status: "REJECTED" });
                      }}>
                        <Button type="submit" size="sm" variant="destructive">Reject</Button>
                      </form>
                    </div>
                  </div>

                  {entry.proofUrl && (
                    <a href={entry.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-block mb-3">
                      <img src={entry.proofUrl} alt="Proof" className="h-24 w-auto rounded-lg border border-[#2A2A2A] object-cover hover:opacity-80 transition-opacity" />
                    </a>
                  )}

                  <div className="rounded-lg bg-[#1E1E1E] p-3 text-xs text-[#A0A0A0] font-mono max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(parsedValue, null, 2)}</pre>
                  </div>

                  {entry.notes && (
                    <p className="text-sm text-[#A0A0A0] mt-2 italic">Note: {entry.notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
