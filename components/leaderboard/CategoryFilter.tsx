"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Dumbbell, Crosshair, Crown, Zap, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "All", icon: LayoutGrid, href: "/leaderboard" },
  { value: "fitness", label: "Fitness", icon: Dumbbell, href: "/leaderboard/fitness" },
  { value: "pubg", label: "PUBG", icon: Crosshair, href: "/leaderboard/pubg" },
  { value: "chess", label: "Chess", icon: Crown, href: "/leaderboard/chess" },
  { value: "speed", label: "Speed", icon: Zap, href: "/leaderboard/speed" },
];

interface CategoryFilterProps {
  active: string;
}

export function CategoryFilter({ active }: CategoryFilterProps) {
  const router = useRouter();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => router.push(cat.href)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0",
            active === cat.value
              ? "bg-[#DC143C] text-white"
              : "bg-[#1E1E1E] text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white border border-[#2A2A2A]"
          )}
        >
          <cat.icon className="h-4 w-4" />
          {cat.label}
        </button>
      ))}
    </div>
  );
}
