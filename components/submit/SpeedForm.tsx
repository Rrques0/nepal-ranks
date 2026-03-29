"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { speedSchema, type SpeedInput } from "@/lib/validations/speed";
import { submitSpeedAction } from "@/lib/actions/submit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProofUpload } from "./ProofUpload";
import { Zap, CheckCircle } from "lucide-react";

export function SpeedForm() {
  const [proofUrl, setProofUrl] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpeedInput>({ resolver: zodResolver(speedSchema) });

  const { execute, isExecuting } = useAction(submitSpeedAction, {
    onSuccess: () => setSuccess(true),
    onError: ({ error }) => console.error(error),
  });

  const onSubmit = (data: SpeedInput) => {
    execute({ ...data, proofUrl });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Stats Submitted!</h3>
        <p className="text-[#A0A0A0] mb-6">Your speed stats are under review.</p>
        <a href="/leaderboard/speed"><Button>View Speed Leaderboard</Button></a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Zap className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Submit Speed & Reaction Stats</h2>
          <p className="text-sm text-[#A0A0A0]">Track your raw speed and reflex scores</p>
        </div>
      </div>

      {/* Coming soon mini-game teaser */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-white text-sm">In-App Reaction Test</p>
          <p className="text-xs text-[#A0A0A0]">Test your reaction time directly in the app</p>
        </div>
        <Button variant="outline" size="sm" disabled>
          Coming Soon
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Reaction Time (ms)"
          type="number"
          step="1"
          placeholder="e.g. 180"
          {...register("reactionTimeMs", { valueAsNumber: true })}
          error={errors.reactionTimeMs?.message}
        />
        <Input
          label="Best Reaction Time (ms)"
          type="number"
          step="1"
          placeholder="Your personal best reaction time"
          {...register("bestReactionMs", { valueAsNumber: true })}
          error={errors.bestReactionMs?.message}
        />
        <Input
          label="Tapping Speed (taps/sec)"
          type="number"
          step="0.1"
          placeholder="e.g. 10.5"
          {...register("tappingSpeed", { valueAsNumber: true })}
          error={errors.tappingSpeed?.message}
        />
        <Input
          label="Sprint 100m Time (seconds)"
          type="number"
          step="0.01"
          placeholder="e.g. 12.5"
          {...register("sprintTimeSec", { valueAsNumber: true })}
          error={errors.sprintTimeSec?.message}
        />
        <div className="sm:col-span-2">
          <Input
            label="Challenge Completions"
            type="number"
            placeholder="Number of speed challenges completed"
            {...register("challengeCompletions", { valueAsNumber: true })}
            error={errors.challengeCompletions?.message}
          />
        </div>
      </div>

      <ProofUpload
        label="Upload Proof (reaction test screenshot, sprint video)"
        onUploadComplete={setProofUrl}
      />

      <Button type="submit" loading={isExecuting} className="w-full" size="lg">
        Submit Stats
      </Button>
    </form>
  );
}
