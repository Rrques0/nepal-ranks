import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { getTopByCity } from "@/lib/db/queries";
import { getInitials } from "@/lib/utils";
import { CITIES } from "@/lib/constants";

export async function TopByCity() {
  // Show top cities with their best performers
  const cityData = await Promise.all(
    ["Kathmandu", "Pokhara", "Biratnagar", "Birgunj", "Dharan"].map(async (city) => {
      const stats = await getTopByCity(city, 3);
      return { city, stats };
    })
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-[#DC143C]" />
        <h3 className="text-lg font-bold text-white">Top By City</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cityData.map(({ city, stats }) => (
          <div key={city} className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
            <h4 className="font-bold text-white mb-3">{city}</h4>
            {stats.length === 0 ? (
              <p className="text-xs text-[#6B7280]">Be the first in {city}!</p>
            ) : (
              <div className="space-y-2">
                {stats.map((stat, idx) => (
                  <Link
                    key={stat.id}
                    href={`/user/${stat.user.username}`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <span className={`text-xs font-bold w-4 ${idx === 0 ? "text-[#FFD700]" : "text-[#6B7280]"}`}>
                      #{idx + 1}
                    </span>
                    <div className="h-7 w-7 rounded-full overflow-hidden shrink-0">
                      {stat.user.avatarUrl ? (
                        <Image src={stat.user.avatarUrl} alt={stat.user.displayName} width={28} height={28} className="object-cover" />
                      ) : (
                        <div className="h-full w-full bg-[#DC143C]/20 text-[#DC143C] flex items-center justify-center font-bold text-xs">
                          {getInitials(stat.user.displayName)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-white font-medium truncate flex-1">
                      {stat.user.displayName}
                    </span>
                    <span className="text-xs text-[#A0A0A0] font-medium shrink-0">
                      {Math.round(stat.rankScore)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
