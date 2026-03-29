"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { pubgSchema, type PubgInput } from "@/lib/validations/pubg";
import { submitPubgAction } from "@/lib/actions/submit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProofUpload } from "./ProofUpload";
import { Crosshair, CheckCircle } from "lucide-react";
import { PUBG_RANK_TIERS } from "@/lib/constants";

export function PubgForm() {
  const [proofUrl, setProofUrl] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PubgInput>({ resolver: zodResolver(pubgSchema) });

  const { execute, isExecuting } = useAction(submitPubgAction, {
    onSuccess: () => setSuccess(true),
    onError: ({ error }) => console.error(error),
  });

  const onSubmit = (data: PubgInput) => {
    execute({ ...data, proofUrl });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Stats Submitted!</h3>
        <p className="text-[#A0A0A0] mb-6">Your submission is under review.</p>
        <a href="/leaderboard/pubg"><Button>View PUBG Leaderboard</Button></a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
          <Crosshair className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Submit PUBG Stats</h2>
          <p className="text-sm text-[#A0A0A0]">PUBG Mobile season stats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="K/D Ratio"
          type="number"
          step="0.01"
          placeholder="e.g. 3.45"
          {...register("kdRatio", { valueAsNumber: true })}
          error={errors.kdRatio?.message}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white">Rank Tier</label>
          <Controller
            name="rankTier"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger error={errors.rankTier?.message}>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {PUBG_RANK_TIERS.map((tier) => (
                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.rankTier && <p className="text-xs text-red-400">{errors.rankTier.message}</p>}
        </div>

        <Input
          label="Total Wins"
          type="number"
          placeholder="e.g. 250"
          {...register("totalWins", { valueAsNumber: true })}
          error={errors.totalWins?.message}
        />
        <Input
          label="Total Matches"
          type="number"
          placeholder="e.g. 1500"
          {...register("totalMatches", { valueAsNumber: true })}
          error={errors.totalMatches?.message}
        />
        <Input
          label="Avg Damage per Match"
          type="number"
          step="0.1"
          placeholder="e.g. 350"
          {...register("avgDamage", { valueAsNumber: true })}
          error={errors.avgDamage?.message}
        />
        <Input
          label="Headshot %"
          type="number"
          step="0.1"
          placeholder="e.g. 25.5"
          {...register("headshotPct", { valueAsNumber: true })}
          error={errors.headshotPct?.message}
        />
        <Input
          label="Solo K/D"
          type="number"
          step="0.01"
          placeholder="e.g. 2.8"
          {...register("soloKd", { valueAsNumber: true })}
          error={errors.soloKd?.message}
        />
        <Input
          label="Squad K/D"
          type="number"
          step="0.01"
          placeholder="e.g. 4.2"
          {...register("squadKd", { valueAsNumber: true })}
          error={errors.squadKd?.message}
        />
        <div className="sm:col-span-2">
          <Input
            label="Current Season"
            placeholder="e.g. Season C7S23"
            {...register("currentSeason")}
            error={errors.currentSeason?.message}
          />
        </div>
      </div>

      <ProofUpload
        label="Upload Screenshot Proof (PUBG stats screen)"
        onUploadComplete={setProofUrl}
      />

      <Button type="submit" loading={isExecuting} className="w-full" size="lg">
        Submit Stats
      </Button>
    </form>
  );
}
