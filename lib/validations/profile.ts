import { z } from "zod";
import { PROVINCES } from "@/lib/constants";

export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be under 50 characters")
    .optional(),
  fullName: z.string().max(100).optional(),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  province: z.enum(PROVINCES as [string, ...string[]]).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  ageGroup: z.enum(["UNDER_18", "AGE_18_24", "AGE_25_34", "OVER_34"]).optional(),
  profileType: z
    .enum([
      "ATHLETE",
      "GAMER",
      "CHESS_PLAYER",
      "PUBLIC_FIGURE",
      "INFLUENCER",
      "DEFAULT",
    ])
    .optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
