import Link from "next/link";
import { Trophy, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dbUser = null;
  if (user) {
    dbUser = await getUserBySupabaseId(user.id);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#2A2A2A] bg-[#0A0A0A]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DC143C]">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-white group-hover:text-[#DC143C] transition-colors">
              NEPAL<span className="text-[#DC143C] group-hover:text-white transition-colors">RANKS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/leaderboard"
              className="text-sm text-[#A0A0A0] hover:text-white transition-colors font-medium"
            >
              Leaderboard
            </Link>
            <Link
              href="/leaders"
              className="text-sm text-[#A0A0A0] hover:text-white transition-colors font-medium"
            >
              Leaders
            </Link>
            <Link
              href="/challenges"
              className="text-sm text-[#A0A0A0] hover:text-white transition-colors font-medium"
            >
              Challenges
            </Link>
            <Link
              href="/explore"
              className="text-sm text-[#A0A0A0] hover:text-white transition-colors font-medium"
            >
              Explore
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {dbUser ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-[#DC143C] transition-all">
                    <AvatarImage src={dbUser.avatarUrl ?? undefined} alt={dbUser.displayName} />
                    <AvatarFallback>{getInitials(dbUser.displayName)}</AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Join Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
