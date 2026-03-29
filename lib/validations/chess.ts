import { z } from "zod";

export const chessSchema = z.object({
  chessRating: z
    .number()
    .int()
    .min(100, "Rating seems too low")
    .max(3500, "Rating seems too high")
    .optional()
    .nullable(),
  chessUsername: z.string().max(50).optional().nullable(),
  winRate: z.number().min(0).max(100).optional().nullable(),
  winStreak: z.number().int().min(0).optional().nullable(),
  totalGames: z.number().int().min(0).optional().nullable(),
  tournamentPlacements: z.number().int().min(0).optional().nullable(),
  notes: z.string().max(500).optional(),
});

export type ChessInput = z.infer<typeof chessSchema>;
