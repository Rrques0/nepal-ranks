"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Send,
  Compass,
  User,
  Zap,
  Crown,
  Crosshair,
  Dumbbell,
  Swords,
  Star,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  {
    label: "Submit Stats",
    icon: Send,
    children: [
      { href: "/submit/fitness", label: "Fitness", icon: Dumbbell },
      { href: "/submit/pubg", label: "PUBG", icon: Crosshair },
      { href: "/submit/chess", label: "Chess", icon: Crown },
      { href: "/submit/speed", label: "Speed", icon: Zap },
    ],
  },
  { href: "/challenges", label: "Challenges", icon: Swords },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/leaders", label: "Leaders", icon: Star },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/upgrade", label: "Go Premium", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r border-[#2A2A2A] bg-[#0A0A0A] py-6">
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          if ("children" in item && item.children) {
            const isActive = item.children.some((c) => pathname === c.href);
            return (
              <div key={item.label}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#A0A0A0]",
                    isActive && "text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                <div className="ml-4 mt-1 space-y-1 border-l border-[#2A2A2A] pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname === child.href
                          ? "bg-[#DC143C]/10 text-[#DC143C] font-medium"
                          : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-white"
                      )}
                    >
                      <child.icon className="h-4 w-4" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-[#DC143C]/10 text-[#DC143C] border border-[#DC143C]/20"
                  : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.href === "/upgrade" && (
                <span className="ml-auto text-xs bg-[#FFD700] text-black px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
