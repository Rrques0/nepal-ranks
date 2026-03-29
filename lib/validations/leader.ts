import { z } from "zod";
import { PROVINCES } from "@/lib/constants";

export const voteSchema = z.object({
  figureId: z.string().min(1, "Figure ID required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

export const leaderCreateSchema = z.object({
  name: z.string().min(2).max(100),
  office: z.string().min(2).max(100),
  officeLevel: z.enum(["LOCAL", "MUNICIPAL", "DISTRICT", "PROVINCIAL", "NATIONAL"]),
  region: z.string().max(100).optional(),
  province: z.enum(PROVINCES as [string, ...string[]]).optional(),
  party: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  photoUrl: z.string().url().optional(),
});

export type VoteInput = z.infer<typeof voteSchema>;
export type LeaderCreateInput = z.infer<typeof leaderCreateSchema>;
