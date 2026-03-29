import { prisma } from "@/lib/db/client";
import { resolveReportAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { Flag } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = { title: "Reports" };

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 30,
    include: {
      reporter: { select: { username: true, displayName: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Flag className="h-6 w-6 text-red-400" />
        <div>
          <h1 className="text-2xl font-black text-white">Reports Queue</h1>
          <p className="text-[#A0A0A0] text-sm">{reports.length} pending reports</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <EmptyState title="No open reports" description="All reports have been reviewed." />
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="destructive">{report.targetType}</Badge>
                    <span className="text-xs text-[#6B7280]">ID: {report.targetId.slice(0, 8)}…</span>
                  </div>
                  <p className="font-medium text-white text-sm">Reason: {report.reason}</p>
                  <p className="text-xs text-[#6B7280]">
                    Reported by @{report.reporter.username} · {formatRelativeTime(report.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={async () => {
                    "use server";
                    await resolveReportAction({ reportId: report.id, status: "REVIEWED" });
                  }}>
                    <Button type="submit" size="sm" variant="outline">Mark Reviewed</Button>
                  </form>
                  <form action={async () => {
                    "use server";
                    await resolveReportAction({ reportId: report.id, status: "RESOLVED" });
                  }}>
                    <Button type="submit" size="sm">Resolve</Button>
                  </form>
                </div>
              </div>
              {report.description && (
                <p className="text-sm text-[#A0A0A0] mt-2 border-t border-[#2A2A2A] pt-2">{report.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
