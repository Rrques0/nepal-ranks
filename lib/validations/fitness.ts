import { z } from "zod";

export const fitnessSchema = z.object({
  benchPressMax: z
    .number()
    .min(0)
    .max(500, "Value seems unrealistic")
    .optional()
    .nullable(),
  squatMax: z.number().min(0).max(700).optional().nullable(),
  deadliftMax: z.number().min(0).max(800).optional().nullable(),
  overheadPressMax: z.number().min(0).max(300).optional().nullable(),
  pullUpsMax: z.number().int().min(0).max(200).optional().nullable(),
  pushUpsMax: z.number().int().min(0).max(500).optional().nullable(),
  bodyweightKg: z
    .number()
    .min(30, "Bodyweight seems too low")
    .max(300)
    .optional()
    .nullable(),
  consistencyStreak: z.number().int().min(0).max(3650).optional().nullable(),
  totalVolumeKg: z.number().min(0).optional().nullable(),
  notes: z.string().max(500).optional(),
});

export type FitnessInput = z.infer<typeof fitnessSchema>;
