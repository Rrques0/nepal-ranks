"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { joinChallengeAction } from "@/lib/actions/challenges";
import { CheckCircle } from "lucide-react";

interface JoinButtonProps {
  challengeId: string;
  isJoined?: boolean;
  entryFeeNPR?: number;
  isLoggedIn?: boolean;
}

export function JoinButton({ challengeId, isJoined, entryFeeNPR, isLoggedIn }: JoinButtonProps) {
  const [joined, setJoined] = useState(isJoined ?? false);
  const [error, setError] = useState<string | null>(null);

  const { execute, isExecuting } = useAction(joinChallengeAction, {
    onSuccess: () => setJoined(true),
    onError: ({ error }) => setError(typeof error.serverError === "string" ? error.serverError : "Failed to join"),
  });

  if (!isLoggedIn) {
    return (
      <a href="/signup">
        <Button className="w-full">Sign Up to Join</Button>
      </a>
    );
  }

  if (joined) {
    return (
      <div className="flex items-center justify-center gap-2 h-11 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-medium text-sm">
        <CheckCircle className="h-4 w-4" />
        You&apos;ve Joined!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        loading={isExecuting}
        onClick={() => execute({ challengeId })}
      >
        {entryFeeNPR && entryFeeNPR > 0
          ? `Join — NPR ${entryFeeNPR}`
          : "Join Challenge Free"}
      </Button>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
