"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, Send, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/submit/fitness", label: "Submit", icon: Send },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-[#2A2A2A] bg-[#0A0A0A]/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-around px-2">
        {mobileNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[56px]",
                isActive
                  ? "text-[#DC143C]"
                  : "text-[#6B7280] hover:text-[#A0A0A0]"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110 transition-transform")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
