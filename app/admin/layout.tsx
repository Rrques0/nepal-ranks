import Link from "next/link";
import { Trophy, Users, FileCheck, Star, Flag, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Submissions", icon: FileCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/leaders", label: "Leaders", icon: Star },
  { href: "/admin/reports", label: "Reports", icon: Flag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <header className="sticky top-0 z-40 border-b border-[#DC143C]/30 bg-[#0A0A0A]/95 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4 gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#DC143C]">
              <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-black text-sm text-white">NEPALRANKS ADMIN</span>
          </Link>
          <nav className="flex items-center gap-1 ml-6 overflow-x-auto">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E] whitespace-nowrap transition-colors"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
