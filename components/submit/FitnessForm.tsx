"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { fitnessSchema, type FitnessInput } from "@/lib/validations/fitness";
import { submitFitnessAction } from "@/lib/actions/submit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProofUpload } from "./ProofUpload";
import { Dumbbell, CheckCircle } from "lucide-react";

export function FitnessForm() {
  const [proofUrl, setProofUrl] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FitnessInput>({ resolver: zodResolver(fitnessSchema) });

  const { execute, isExecuting } = useAction(submitFitnessAction, {
    onSuccess: () => setSuccess(true),
    onError: ({ error }) => console.error(error),
  });

  const onSubmit = (data: FitnessInput) => {
    execute({ ...data, proofUrl });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Stats Submitted!</h3>
        <p className="text-[#A0A0A0] mb-6">Your submission is under review. Rankings update after approval.</p>
        <a href="/leaderboard/fitness">
          <Button>View Leaderboard</Button>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
          <Dumbbell className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Submit Fitness Stats</h2>
          <p className="text-sm text-[#A0A0A0]">All weights in kilograms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bench Press Max (kg)"
          type="number"
          step="0.5"
          placeholder="e.g. 100"
          {...register("benchPressMax", { valueAsNumber: true })}
          error={errors.benchPressMax?.message}
        />
        <Input
          label="Squat Max (kg)"
          type="number"
          step="0.5"
          placeholder="e.g. 140"
          {...register("squatMax", { valueAsNumber: true })}
          error={errors.squatMax?.message}
        />
        <Input
          label="Deadlift Max (kg)"
          type="number"
          step="0.5"
          placeholder="e.g. 180"
          {...register("deadliftMax", { valueAsNumber: true })}
          error={errors.deadliftMax?.message}
        />
        <Input
          label="Overhead Press Max (kg)"
          type="number"
          step="0.5"
          placeholder="e.g. 70"
          {...register("overheadPressMax", { valueAsNumber: true })}
          error={errors.overheadPressMax?.message}
        />
        <Input
          label="Pull-ups Max (reps)"
          type="number"
          placeholder="e.g. 20"
          {...register("pullUpsMax", { valueAsNumber: true })}
          error={errors.pullUpsMax?.message}
        />
        <Input
          label="Push-ups Max (reps)"
          type="number"
          placeholder="e.g. 50"
          {...register("pushUpsMax", { valueAsNumber: true })}
          error={errors.pushUpsMax?.message}
        />
        <Input
          label="Bodyweight (kg)"
          type="number"
          step="0.1"
          placeholder="e.g. 75"
          {...register("bodyweightKg", { valueAsNumber: true })}
          error={errors.bodyweightKg?.message}
        />
        <Input
          label="Consistency Streak (days)"
          type="number"
          placeholder="e.g. 30"
          {...register("consistencyStreak", { valueAsNumber: true })}
          error={errors.consistencyStreak?.message}
        />
        <div className="sm:col-span-2">
          <Input
            label="Total Volume Lifted (kg)"
            type="number"
            placeholder="Total kg lifted across all sets this month"
            {...register("totalVolumeKg", { valueAsNumber: true })}
            error={errors.totalVolumeKg?.message}
          />
        </div>
      </div>

      <ProofUpload
        label="Upload Proof (gym photo, video, screenshot)"
        onUploadComplete={setProofUrl}
      />

      <div className="rounded-lg bg-[#DC143C]/10 border border-[#DC143C]/20 p-4 text-sm text-[#A0A0A0]">
        <strong className="text-white">Verification:</strong> Submissions with photo proof are prioritized for verification. Verified stats earn +50 bonus points.
      </div>

      <Button type="submit" loading={isExecuting} className="w-full" size="lg">
        Submit Stats
      </Button>
    </form>
  );
}
