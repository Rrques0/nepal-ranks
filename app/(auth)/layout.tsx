import Link from "next/link";
import { Trophy } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Simple auth header */}
      <header className="p-4 flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DC143C]">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-lg text-white">
            NEPAL<span className="text-[#DC143C]">RANKS</span>
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
