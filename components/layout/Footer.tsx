import Link from "next/link";
import { Trophy } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-12 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DC143C]">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-lg text-white">
                NEPAL<span className="text-[#DC143C]">RANKS</span>
              </span>
            </Link>
            <p className="text-sm text-[#A0A0A0]">
              Nepal Ko Leaderboard — the competitive ranking platform for Nepali athletes, gamers, and citizens.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: "/leaderboard", label: "Leaderboard" },
                { href: "/challenges", label: "Challenges" },
                { href: "/explore", label: "Explore" },
                { href: "/leaders", label: "Leaders" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A0A0A0] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              {[
                { href: "/leaderboard/fitness", label: "Fitness" },
                { href: "/leaderboard/pubg", label: "PUBG Mobile" },
                { href: "/leaderboard/chess", label: "Chess" },
                { href: "/leaderboard/speed", label: "Speed & Reaction" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A0A0A0] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Account</h4>
            <ul className="space-y-2">
              {[
                { href: "/signup", label: "Join Free" },
                { href: "/login", label: "Login" },
                { href: "/upgrade", label: "Premium" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A0A0A0] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[#2A2A2A] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B7280]">
            © 2025 Nepal Ranks. All rights reserved.
          </p>
          <p className="text-xs text-[#6B7280]">
            Leaders section ratings are user opinions only and do not represent official endorsements.
          </p>
        </div>
      </div>
    </footer>
  );
}
