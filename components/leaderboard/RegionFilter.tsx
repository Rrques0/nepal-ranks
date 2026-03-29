"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES, CITIES, GENDER_OPTIONS, AGE_GROUPS } from "@/lib/constants";

interface RegionFilterProps {
  currentFilters: {
    province?: string;
    city?: string;
    gender?: string;
    ageGroup?: string;
    scope?: string;
  };
}

export function RegionFilter({ currentFilters }: RegionFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
        // Reset city if province changes
        if (key === "province") params.delete("city");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-2">
      {/* Scope toggle */}
      <div className="flex rounded-lg border border-[#2A2A2A] overflow-hidden">
        {["national", "province", "city"].map((scope) => (
          <button
            key={scope}
            onClick={() => updateFilter("scope", scope)}
            className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
              (currentFilters.scope ?? "national") === scope
                ? "bg-[#DC143C] text-white"
                : "bg-[#1E1E1E] text-[#A0A0A0] hover:text-white"
            }`}
          >
            {scope}
          </button>
        ))}
      </div>

      {/* Province */}
      <Select
        value={currentFilters.province ?? "all"}
        onValueChange={(v) => updateFilter("province", v)}
      >
        <SelectTrigger className="w-36 h-9 text-xs">
          <SelectValue placeholder="Province" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Provinces</SelectItem>
          {PROVINCES.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City */}
      <Select
        value={currentFilters.city ?? "all"}
        onValueChange={(v) => updateFilter("city", v)}
      >
        <SelectTrigger className="w-36 h-9 text-xs">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {CITIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Gender */}
      <Select
        value={currentFilters.gender ?? "all"}
        onValueChange={(v) => updateFilter("gender", v)}
      >
        <SelectTrigger className="w-28 h-9 text-xs">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {GENDER_OPTIONS.map((g) => (
            <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Age Group */}
      <Select
        value={currentFilters.ageGroup ?? "all"}
        onValueChange={(v) => updateFilter("ageGroup", v)}
      >
        <SelectTrigger className="w-28 h-9 text-xs">
          <SelectValue placeholder="Age" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ages</SelectItem>
          {AGE_GROUPS.map((a) => (
            <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
