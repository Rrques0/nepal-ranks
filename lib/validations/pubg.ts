import { z } from "zod";
import { PUBG_RANK_TIERS } from "@/lib/constants";

export const pubgSchema = z.object({
  kdRatio: z
    .number()
    .min(0)
    .max(50, "KD ratio seems unrealistic")
    .optional()
    .nullable(),
  rankTier: z
    .enum(PUBG_RANK_TIERS as [string, ...string[]])
    .optional()
    .nullable(),
  totalWins: z.number().int().min(0).optional().nullable(),
  top10Rate: z.number().min(0).max(100).optional().nullable(),
  avgDamage: z.number().min(0).max(3000).optional().nullable(),
  headshotPct: z.number().min(0).max(100).optional().nullable(),
  totalMatches: z.number().int().min(0).optional().nullable(),
  soloKd: z.number().min(0).max(50).optional().nullable(),
  duoKd: z.number().min(0).max(50).optional().nullable(),
  squadKd: z.number().min(0).max(50).optional().nullable(),
  currentSeason: z.string().max(20).optional().nullable(),
  notes: z.string().max(500).optional(),
});

export type PubgInput = z.infer<typeof pubgSchema>;
