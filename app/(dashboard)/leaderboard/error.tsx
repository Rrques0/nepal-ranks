"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="h-12 w-12 text-[#DC143C] mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Leaderboard failed to load</h2>
      <p className="text-[#A0A0A0] text-sm mb-6">{error.message}</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
