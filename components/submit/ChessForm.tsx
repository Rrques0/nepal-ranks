"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { chessSchema, type ChessInput } from "@/lib/validations/chess";
import { submitChessAction } from "@/lib/actions/submit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProofUpload } from "./ProofUpload";
import { Crown, CheckCircle, ExternalLink } from "lucide-react";

export function ChessForm() {
  const [proofUrl, setProofUrl] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChessInput>({ resolver: zodResolver(chessSchema) });

  const chessUsername = watch("chessUsername");

  const { execute, isExecuting } = useAction(submitChessAction, {
    onSuccess: () => setSuccess(true),
    onError: ({ error }) => console.error(error),
  });

  const onSubmit = (data: ChessInput) => {
    execute({ ...data, proofUrl });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Stats Submitted!</h3>
        <p className="text-[#A0A0A0] mb-6">Your chess stats are under review.</p>
        <a href="/leaderboard/chess"><Button>View Chess Leaderboard</Button></a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <Crown className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Submit Chess Stats</h2>
          <p className="text-sm text-[#A0A0A0]">Your Chess.com or FIDE rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Chess.com Username"
            placeholder="Enter your Chess.com username"
            {...register("chessUsername")}
            error={errors.chessUsername?.message}
          />
          {chessUsername && chessUsername.length > 2 && (
            <a
              href={`https://www.chess.com/member/${chessUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#DC143C] hover:underline mt-1"
            >
              <ExternalLink className="h-3 w-3" />
              View on Chess.com
            </a>
          )}
        </div>

        <Input
          label="Current Rating"
          type="number"
          placeholder="e.g. 1500"
          {...register("chessRating", { valueAsNumber: true })}
          error={errors.chessRating?.message}
        />
        <Input
          label="Win Rate (%)"
          type="number"
          step="0.1"
          placeholder="e.g. 60"
          {...register("winRate", { valueAsNumber: true })}
          error={errors.winRate?.message}
        />
        <Input
          label="Win Streak"
          type="number"
          placeholder="e.g. 12"
          {...register("winStreak", { valueAsNumber: true })}
          error={errors.winStreak?.message}
        />
        <Input
          label="Total Games"
          type="number"
          placeholder="e.g. 3000"
          {...register("totalGames", { valueAsNumber: true })}
          error={errors.totalGames?.message}
        />
        <div className="sm:col-span-2">
          <Input
            label="Tournament Placements (top 10s)"
            type="number"
            placeholder="Number of tournament top-10 finishes"
            {...register("tournamentPlacements", { valueAsNumber: true })}
            error={errors.tournamentPlacements?.message}
          />
        </div>
      </div>

      <ProofUpload
        label="Upload Screenshot (Chess.com stats page)"
        onUploadComplete={setProofUrl}
      />

      <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-4 text-sm text-[#A0A0A0]">
        <strong className="text-white">Tip:</strong> Screenshot your Chess.com profile stats page showing your username and rating. This helps verify your submission faster.
      </div>

      <Button type="submit" loading={isExecuting} className="w-full" size="lg">
        Submit Stats
      </Button>
    </form>
  );
}
