import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DC143C]/10 mb-6">
          <Trophy className="h-10 w-10 text-[#DC143C]" />
        </div>
        <h1 className="text-6xl font-black text-white mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page not found</h2>
        <p className="text-[#A0A0A0] mb-8 max-w-sm">
          This page doesn&apos;t exist on Nepal Ranks. Maybe the URL is wrong or the content was removed.
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline">View Rankings</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
