import { getAllUsers } from "@/lib/db/queries";
import { banUserAction, verifyUserAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Manage Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const { users, total, totalPages } = await getAllUsers(page, 20, params.search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-black text-white">Manage Users</h1>
            <p className="text-[#A0A0A0] text-sm">{total} total users</p>
          </div>
        </div>
        <form>
          <input
            name="search"
            defaultValue={params.search}
            placeholder="Search username or email..."
            className="h-9 w-64 rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] px-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#DC143C] focus:outline-none"
          />
        </form>
      </div>

      <div className="rounded-xl border border-[#2A2A2A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1E1E1E] border-b border-[#2A2A2A]">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-[#6B7280]">User</th>
                <th className="text-left p-3 text-xs font-medium text-[#6B7280]">Role</th>
                <th className="text-left p-3 text-xs font-medium text-[#6B7280]">Location</th>
                <th className="text-left p-3 text-xs font-medium text-[#6B7280]">Joined</th>
                <th className="text-left p-3 text-xs font-medium text-[#6B7280]">Status</th>
                <th className="p-3 text-xs font-medium text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {users.map((u) => (
                <tr key={u.id} className="bg-[#141414] hover:bg-[#1A1A1A]">
                  <td className="p-3">
                    <div className="font-medium text-white text-sm">{u.displayName}</div>
                    <div className="text-xs text-[#6B7280]">@{u.username}</div>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">{u.role}</Badge>
                  </td>
                  <td className="p-3 text-sm text-[#A0A0A0]">{[u.city, u.province].filter(Boolean).join(", ") || "—"}</td>
                  <td className="p-3 text-xs text-[#6B7280]">{formatDate(u.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {u.isVerified && <Badge variant="verified" className="text-xs">Verified</Badge>}
                      {u.isPremium && <Badge variant="premium" className="text-xs">Premium</Badge>}
                      {u.isBanned && <Badge variant="destructive" className="text-xs">Banned</Badge>}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {!u.isVerified && (
                        <form action={async () => {
                          "use server";
                          await verifyUserAction({ userId: u.id });
                        }}>
                          <Button type="submit" size="sm" variant="outline" className="text-xs h-7 px-2">Verify</Button>
                        </form>
                      )}
                      <form action={async () => {
                        "use server";
                        await banUserAction({ userId: u.id, banned: !u.isBanned });
                      }}>
                        <Button
                          type="submit"
                          size="sm"
                          variant={u.isBanned ? "outline" : "destructive"}
                          className="text-xs h-7 px-2"
                        >
                          {u.isBanned ? "Unban" : "Ban"}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && <Link href={`?page=${page - 1}`}><Button variant="outline" size="sm">Previous</Button></Link>}
          <span className="flex items-center text-sm text-[#A0A0A0] px-4">{page} / {totalPages}</span>
          {page < totalPages && <Link href={`?page=${page + 1}`}><Button variant="outline" size="sm">Next</Button></Link>}
        </div>
      )}
    </div>
  );
}
