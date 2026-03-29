"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { voteLeaderAction } from "@/lib/actions/vote";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  figureId: string;
  currentRating?: number;
}

export function VoteButton({ figureId, currentRating }: VoteButtonProps) {
  const [selected, setSelected] = useState(currentRating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [voted, setVoted] = useState(false);

  const { execute, isExecuting } = useAction(voteLeaderAction, {
    onSuccess: () => setVoted(true),
  });

  const handleVote = (rating: number) => {
    setSelected(rating);
    execute({ figureId, rating });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-white">Rate this leader</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isExecuting}
            onClick={() => handleVote(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-lg transition-all",
              "hover:scale-110 active:scale-95",
              (hovered || selected) >= star
                ? "text-[#FFD700]"
                : "text-[#2A2A2A]"
            )}
          >
            <Star
              className="h-6 w-6"
              fill={(hovered || selected) >= star ? "#FFD700" : "none"}
            />
          </button>
        ))}
      </div>
      {voted && (
        <p className="text-sm text-green-400">Your vote has been recorded. Thank you!</p>
      )}
      {currentRating && !voted && (
        <p className="text-xs text-[#6B7280]">Your current rating: {currentRating}/5</p>
      )}
    </div>
  );
}
