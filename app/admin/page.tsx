import { getAdminStats } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";
import { Users, FileCheck, Star, Flag, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recomputeRankingsAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { username: true, displayName: true, city: true, createdAt: true, role: true },
  });

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Pending Submissions", value: stats.pendingSubmissions, icon: FileCheck, color: "text-yellow-400" },
    { label: "Active Leaders", value: stats.totalFigures, icon: Star, color: "text-purple-400" },
    { label: "Open Reports", value: stats.openReports, icon: Flag, color: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
        <form action={async () => {
          "use server";
          await recomputeRankingsAction({});
        }}>
          <Button type="submit" variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Recompute Rankings
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#A0A0A0] uppercase tracking-wide">{card.label}</span>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="text-3xl font-black text-white">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Signups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.username} className="flex items-center justify-between py-2 border-b border-[#2A2A2A] last:border-0">
                <div>
                  <span className="font-medium text-white text-sm">{u.displayName}</span>
                  <span className="text-[#6B7280] text-xs ml-2">@{u.username}</span>
                </div>
                <div className="text-xs text-[#6B7280]">{u.city ?? "—"}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/admin/submissions", label: "Review Submissions", desc: `${stats.pendingSubmissions} pending`, urgent: stats.pendingSubmissions > 0 },
          { href: "/admin/users", label: "Manage Users", desc: `${stats.totalUsers} total`, urgent: false },
          { href: "/admin/reports", label: "Review Reports", desc: `${stats.openReports} open`, urgent: stats.openReports > 0 },
        ].map((item) => (
          <a key={item.href} href={item.href} className={`block rounded-xl border ${item.urgent ? "border-yellow-500/40 bg-yellow-500/5" : "border-[#2A2A2A] bg-[#141414]"} p-5 hover:border-[#DC143C]/40 transition-colors`}>
            <h3 className="font-bold text-white mb-1">{item.label}</h3>
            <p className={`text-sm ${item.urgent ? "text-yellow-400" : "text-[#6B7280]"}`}>{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
