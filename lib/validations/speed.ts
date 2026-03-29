import { z } from "zod";

export const speedSchema = z.object({
  sprintTimeSec: z
    .number()
    .min(9, "That would be a world record!")
    .max(60)
    .optional()
    .nullable(),
  reactionTimeMs: z
    .number()
    .min(100, "That seems impossibly fast")
    .max(2000)
    .optional()
    .nullable(),
  tappingSpeed: z
    .number()
    .int()
    .min(0)
    .max(30, "Tapping speed per second")
    .optional()
    .nullable(),
  challengeCompletions: z.number().int().min(0).optional().nullable(),
  bestReactionMs: z.number().min(100).max(2000).optional().nullable(),
  notes: z.string().max(500).optional(),
});

export type SpeedInput = z.infer<typeof speedSchema>;
